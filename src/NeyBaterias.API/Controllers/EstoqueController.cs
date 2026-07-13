using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using NeyBaterias.Application.Interfaces;
using NeyBaterias.Domain.Enums;

namespace NeyBaterias.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class EstoqueController : ControllerBase
{
    private readonly IUnitOfWork _uow;

    public EstoqueController(IUnitOfWork uow) => _uow = uow;

    [HttpGet("movimentos")]
    public async Task<IActionResult> GetMovimentos() =>
        Ok(await _uow.Estoques.Query()
            .Include(e => e.Produto)
            .OrderByDescending(e => e.DataMovimento)
            .ToListAsync());

    [HttpGet("movimentos/produto/{idProduto:int}")]
    public async Task<IActionResult> GetMovimentosPorProduto(int idProduto) =>
        Ok(await _uow.Estoques.Query()
            .Where(e => e.IdProduto == idProduto)
            .OrderByDescending(e => e.DataMovimento)
            .ToListAsync());

    [HttpGet("saldo")]
    public async Task<IActionResult> GetSaldoGeral()
    {
        var saldos = await _uow.Estoques.Query()
            .Include(e => e.Produto)
            .GroupBy(e => new { e.IdProduto, e.Produto.Descricao })
            .Select(g => new
            {
                IdProduto = g.Key.IdProduto,
                Descricao = g.Key.Descricao,
                Saldo = g.Sum(e => e.TipoMovimento == TipoMovimentoEstoque.Entrada
                    ? e.QtdMovimento
                    : -e.QtdMovimento)
            })
            .ToListAsync();

        return Ok(saldos);
    }
}