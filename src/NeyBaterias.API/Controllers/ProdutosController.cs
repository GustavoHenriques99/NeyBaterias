using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using NeyBaterias.Application.DTOs;
using NeyBaterias.Application.Interfaces;
using NeyBaterias.Domain.Entities;
using NeyBaterias.Domain.Enums;

namespace NeyBaterias.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class ProdutosController : ControllerBase
{
    private readonly IUnitOfWork _uow;

    public ProdutosController(IUnitOfWork uow) => _uow = uow;

     [HttpGet]
    public async Task<ActionResult<IEnumerable<ProdutoRespostaDto>>> GetAll()
    {
        var produtos = await _uow.Produtos.Query().Include(p => p.Item).ToListAsync();

        var resposta = produtos.Select(p => new ProdutoRespostaDto
        {
            IdProduto = p.IdProduto,
            Descricao = p.Descricao,
            Amperagem = p.Amperagem,
            Marca = p.Marca,
            Modelo = p.Modelo,
            PrecoCusto = p.PrecoCusto,
            PrecoVenda = p.PrecoVenda
        });

        return Ok(resposta);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<ProdutoRespostaDto>> GetById(int id)
    {
        var produto = await _uow.Produtos.Query()
            .Include(p => p.Item)
            .FirstOrDefaultAsync(p => p.IdProduto == id);

        if (produto is null) return NotFound();

        var resposta = new ProdutoRespostaDto
        {
            IdProduto = produto.IdProduto,
            Descricao = produto.Descricao,
            Amperagem = produto.Amperagem,
            Marca = produto.Marca,
            Modelo = produto.Modelo,
            PrecoCusto = produto.PrecoCusto,
            PrecoVenda = produto.PrecoVenda
        };

        return Ok(resposta);
    }


    [HttpPost]
    public async Task<ActionResult<ProdutoRespostaDto>> Create(CriarProdutoDto dto)
    {
        var item = new Item
        {
            Descricao = dto.Descricao,
            Valor = dto.Valor,
            Tipo = TipoItem.Produto,
            Ativo = true,
            Produto = new Produto
            {
                Descricao = dto.Descricao,
                Amperagem = dto.Amperagem,
                Marca = dto.Marca,
                Modelo = dto.Modelo,
                PrecoCusto = dto.PrecoCusto,
                PrecoVenda = dto.PrecoVenda
            }
        };

        await _uow.Itens.AddAsync(item);
        await _uow.SaveChangesAsync();

        var resposta = new ProdutoRespostaDto
        {
            IdProduto = item.Produto.IdProduto,
            Descricao = item.Produto.Descricao,
            Amperagem = item.Produto.Amperagem,
            Marca = item.Produto.Marca,
            Modelo = item.Produto.Modelo,
            PrecoCusto = item.Produto.PrecoCusto,
            PrecoVenda = item.Produto.PrecoVenda
        };

        return CreatedAtAction(nameof(GetById), new { id = resposta.IdProduto }, resposta);
    }

    // Retorna o saldo atual em estoque do produto (entradas - saídas)
    [HttpGet("{id:int}/saldo-estoque")]
    public async Task<ActionResult<int>> GetSaldoEstoque(int id)
    {
        var produto = await _uow.Produtos.GetByIdAsync(id);
        if (produto is null) return NotFound();

        var movimentos = await _uow.Estoques.FindAsync(e => e.IdProduto == id);
        var saldo = movimentos.Sum(m => m.TipoMovimento == TipoMovimentoEstoque.Entrada
            ? m.QtdMovimento
            : -m.QtdMovimento);

        return Ok(saldo);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var produto = await _uow.Produtos.GetByIdAsync(id);
        if (produto is null) return NotFound();

        _uow.Produtos.Remove(produto);

        try
        {
            await _uow.SaveChangesAsync();
        }
        catch (DbUpdateException)
        {
            return Conflict(new { erro = "Não é possível excluir: este produto está vinculado a vendas ou reposições." });
        }

        return NoContent();
    }
    

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, AtualizarProdutoDto dto)
    {
        var produto = await _uow.Produtos.Query()
            .Include(p => p.Item)
            .FirstOrDefaultAsync(p => p.IdProduto == id);

        if (produto is null) return NotFound();

        produto.Descricao = dto.Descricao;
        produto.Amperagem = dto.Amperagem;
        produto.Marca = dto.Marca;
        produto.Modelo = dto.Modelo;
        produto.PrecoCusto = dto.PrecoCusto;
        produto.PrecoVenda = dto.PrecoVenda;

        produto.Item.Descricao = dto.Descricao;
        produto.Item.Valor = dto.Valor;

        _uow.Produtos.Update(produto);
        await _uow.SaveChangesAsync();

        return NoContent();
    }

    
}