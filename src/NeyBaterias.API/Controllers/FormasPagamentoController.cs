using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using NeyBaterias.Application.Interfaces;
using NeyBaterias.Domain.Entities;

namespace NeyBaterias.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class FormasPagamentoController : ControllerBase
{
    private readonly IUnitOfWork _uow;

    public FormasPagamentoController(IUnitOfWork uow) => _uow = uow;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<FormaPagamento>>> GetAll() =>
        Ok(await _uow.FormasPagamento.GetAllAsync());

    [HttpGet("{id:int}")]
    public async Task<ActionResult<FormaPagamento>> GetById(int id)
    {
        var forma = await _uow.FormasPagamento.GetByIdAsync(id);
        return forma is null ? NotFound() : Ok(forma);
    }

    [HttpPost]
    public async Task<ActionResult<FormaPagamento>> Create(FormaPagamento forma)
    {
        await _uow.FormasPagamento.AddAsync(forma);
        await _uow.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = forma.IdPagamento }, forma);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var forma = await _uow.FormasPagamento.GetByIdAsync(id);
        if (forma is null) return NotFound();

        _uow.FormasPagamento.Remove(forma);
        await _uow.SaveChangesAsync();
        return NoContent();
    }


    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, FormaPagamento forma)
    {
        if (id != forma.IdPagamento) return BadRequest();

        var existente = await _uow.FormasPagamento.GetByIdAsync(id);
        if (existente is null) return NotFound();

        _uow.FormasPagamento.Update(forma);
        await _uow.SaveChangesAsync();
        return NoContent();
    }
}