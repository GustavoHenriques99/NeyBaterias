using Microsoft.EntityFrameworkCore;
using NeyBaterias.Application.DTOs;
using NeyBaterias.Application.Interfaces;
using NeyBaterias.Domain.Entities;
using NeyBaterias.Domain.Enums;

namespace NeyBaterias.Application.Services;

public class CompraReposicaoService : ICompraReposicaoService
{
    private readonly IUnitOfWork _uow;

    public CompraReposicaoService(IUnitOfWork uow)
    {
        _uow = uow;
    }

    public async Task<CompraReposicao> RegistrarReposicaoAsync(CriarCompraReposicaoDto dto)
    {
        if (dto.Itens is null || dto.Itens.Count == 0)
            throw new InvalidOperationException("A reposição precisa ter ao menos um item.");

        var fornecedor = await _uow.Fornecedores.GetByIdAsync(dto.IdFornecedor)
            ?? throw new InvalidOperationException("Fornecedor não encontrado.");

        var precoTotal = dto.Itens.Sum(i => i.PrecoCompra * i.Qtd);

        var reposicao = new CompraReposicao
        {
            DataReposicao = DateTime.UtcNow,
            IdFornecedor = dto.IdFornecedor,
            Preco = precoTotal
        };

        foreach (var itemDto in dto.Itens)
        {
            var produto = await _uow.Produtos.GetByIdAsync(itemDto.IdProduto)
                ?? throw new InvalidOperationException($"Produto {itemDto.IdProduto} não encontrado.");

            var itemReposicao = new ItemReposicao
            {
                IdProduto = itemDto.IdProduto,
                Qtd = itemDto.Qtd,
                PrecoCompra = itemDto.PrecoCompra,
                MovimentoEstoque = new Estoque
                {
                    IdProduto = produto.IdProduto,
                    QtdMovimento = itemDto.Qtd,
                    TipoMovimento = TipoMovimentoEstoque.Entrada,
                    DataMovimento = DateTime.UtcNow
                }
            };

            reposicao.ItensReposicao.Add(itemReposicao);
        }

        await _uow.ComprasReposicao.AddAsync(reposicao);
        await _uow.SaveChangesAsync();

        return reposicao;
    }


    public async Task ExcluirReposicaoAsync(int idReposicao)
    {
        var reposicao = await _uow.ComprasReposicao.Query()
            .Include(c => c.ItensReposicao)
                .ThenInclude(i => i.MovimentoEstoque)
            .FirstOrDefaultAsync(c => c.IdReposicao == idReposicao)
            ?? throw new InvalidOperationException("Reposição não encontrada.");

        foreach (var itemReposicao in reposicao.ItensReposicao)
        {
            if (itemReposicao.MovimentoEstoque is not null)
            {
                _uow.Estoques.Remove(itemReposicao.MovimentoEstoque);
            }
        }

        _uow.ComprasReposicao.Remove(reposicao);
        await _uow.SaveChangesAsync();
    }
}
