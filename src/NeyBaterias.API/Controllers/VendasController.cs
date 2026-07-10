using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NeyBaterias.Application.DTOs;
using NeyBaterias.Application.Interfaces;

namespace NeyBaterias.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class VendasController : ControllerBase
{
    private readonly IUnitOfWork _uow;
    private readonly IVendaService _vendaService;

    public VendasController(IUnitOfWork uow, IVendaService vendaService)
    {
        _uow = uow;
        _vendaService = vendaService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll() =>
        Ok(await _uow.Vendas.Query()
            .Include(v => v.Cliente)
            .Include(v => v.Operador)
            .Include(v => v.FormaPagamento)
            .Include(v => v.ItensVenda)
            .ToListAsync());

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var venda = await _uow.Vendas.Query()
            .Include(v => v.Cliente)
            .Include(v => v.Operador)
            .Include(v => v.FormaPagamento)
            .Include(v => v.ItensVenda)
                .ThenInclude(iv => iv.Item)
            .FirstOrDefaultAsync(v => v.IdVenda == id);

        return venda is null ? NotFound() : Ok(venda);
    }

    /// <summary>
    /// Registra uma venda completa (cabeçalho + itens) e gera automaticamente
    /// as saídas de estoque para os produtos vendidos.
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> Create(CriarVendaDto dto)
    {
        try
        {
            var venda = await _vendaService.RegistrarVendaAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = venda.IdVenda }, venda);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { erro = ex.Message });
        }
    }
}
