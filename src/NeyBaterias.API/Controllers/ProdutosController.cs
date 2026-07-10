using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NeyBaterias.Application.DTOs;
using NeyBaterias.Application.Interfaces;
using NeyBaterias.Domain.Entities;
using NeyBaterias.Domain.Enums;

namespace NeyBaterias.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProdutosController : ControllerBase
{
    private readonly IUnitOfWork _uow;

    public ProdutosController(IUnitOfWork uow) => _uow = uow;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Produto>>> GetAll() =>
        Ok(await _uow.Produtos.Query().Include(p => p.Item).ToListAsync());

    [HttpGet("{id:int}")]
    public async Task<ActionResult<Produto>> GetById(int id)
    {
        var produto = await _uow.Produtos.Query()
            .Include(p => p.Item)
            .FirstOrDefaultAsync(p => p.IdProduto == id);

        return produto is null ? NotFound() : Ok(produto);
    }

    [HttpPost]
    public async Task<ActionResult<Produto>> Create(CriarProdutoDto dto)
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
        return CreatedAtAction(nameof(GetById), new { id = item.Produto.IdProduto }, item.Produto);
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
        await _uow.SaveChangesAsync();
        return NoContent();
    }
}
