using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NeyBaterias.Application.DTOs;
using NeyBaterias.Application.Interfaces;

namespace NeyBaterias.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ComprasReposicaoController : ControllerBase
{
    private readonly IUnitOfWork _uow;
    private readonly ICompraReposicaoService _compraService;

    public ComprasReposicaoController(IUnitOfWork uow, ICompraReposicaoService compraService)
    {
        _uow = uow;
        _compraService = compraService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll() =>
        Ok(await _uow.ComprasReposicao.Query()
            .Include(c => c.Fornecedor)
            .Include(c => c.ItensReposicao)
            .ToListAsync());

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var reposicao = await _uow.ComprasReposicao.Query()
            .Include(c => c.Fornecedor)
            .Include(c => c.ItensReposicao)
                .ThenInclude(i => i.Produto)
            .FirstOrDefaultAsync(c => c.IdReposicao == id);

        return reposicao is null ? NotFound() : Ok(reposicao);
    }

    /// <summary>
    /// Registra uma compra de reposição (cabeçalho + itens) e gera automaticamente
    /// as entradas de estoque para os produtos repostos.
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> Create(CriarCompraReposicaoDto dto)
    {
        try
        {
            var reposicao = await _compraService.RegistrarReposicaoAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = reposicao.IdReposicao }, reposicao);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { erro = ex.Message });
        }
    }
}
