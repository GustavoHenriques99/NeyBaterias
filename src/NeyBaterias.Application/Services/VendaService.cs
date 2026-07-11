using Microsoft.EntityFrameworkCore;
using NeyBaterias.Application.DTOs;
using NeyBaterias.Application.Interfaces;
using NeyBaterias.Domain.Entities;
using NeyBaterias.Domain.Enums;

namespace NeyBaterias.Application.Services;

public class VendaService : IVendaService
{
    private readonly IUnitOfWork _uow;

    public VendaService(IUnitOfWork uow)
    {
        _uow = uow;
    }

    public async Task<Venda> RegistrarVendaAsync(CriarVendaDto dto)
    {
        if (dto.Itens is null || dto.Itens.Count == 0)
            throw new InvalidOperationException("A venda precisa ter ao menos um item.");

        var cliente = await _uow.Clientes.GetByIdAsync(dto.IdCliente)
            ?? throw new InvalidOperationException("Cliente não encontrado.");

        var operador = await _uow.Operador.GetByIdAsync(dto.IdOperador)
            ?? throw new InvalidOperationException("Operador não encontrado.");

        var pagamento = await _uow.FormasPagamento.GetByIdAsync(dto.IdPagamento)
            ?? throw new InvalidOperationException("Forma de pagamento não encontrada.");

        var precoVendaTotal = dto.Itens.Sum(i => i.PrecoVenda * i.Qtd);

        var venda = new Venda
        {
            DataVenda = DateTime.UtcNow,
            IdCliente = dto.IdCliente,
            IdOperador = dto.IdOperador,
            IdPagamento = dto.IdPagamento,
            Desconto = dto.Desconto,
            PrecoVenda = precoVendaTotal,
            PrecoTotal = precoVendaTotal - dto.Desconto
        };

        foreach (var itemDto in dto.Itens)
        {
            var item = await _uow.Itens.Query()
                .Include(i => i.Produto)
                .FirstOrDefaultAsync(i => i.IdItem == itemDto.IdItem)
                ?? throw new InvalidOperationException($"Item {itemDto.IdItem} não encontrado.");

            var itemVenda = new ItemVenda
            {
                IdItem = itemDto.IdItem,
                Qtd = itemDto.Qtd,
                PrecoVenda = itemDto.PrecoVenda
            };

            if (item.Tipo == TipoItem.Produto && item.Produto is not null)
            {
                var estoqueAtual = await ObterSaldoEstoqueAsync(item.Produto.IdProduto);
                if (estoqueAtual < itemDto.Qtd)
                    throw new InvalidOperationException(
                        $"Estoque insuficiente para o produto '{item.Produto.Descricao}'. Saldo atual: {estoqueAtual}.");

                itemVenda.MovimentoEstoque = new Estoque
                {
                    IdProduto = item.Produto.IdProduto,
                    QtdMovimento = itemDto.Qtd,
                    TipoMovimento = TipoMovimentoEstoque.Saida,
                    DataMovimento = DateTime.UtcNow
                };
            }

            venda.ItensVenda.Add(itemVenda);
        }

        await _uow.Vendas.AddAsync(venda);
        await _uow.SaveChangesAsync();

        return venda;
    }

    private async Task<int> ObterSaldoEstoqueAsync(int idProduto)
    {
        var movimentos = await _uow.Estoques.FindAsync(e => e.IdProduto == idProduto);
        return movimentos.Sum(m => m.TipoMovimento == TipoMovimentoEstoque.Entrada
            ? m.QtdMovimento
            : -m.QtdMovimento);
    }
}