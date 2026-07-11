using Microsoft.AspNetCore.Mvc;
using NeyBaterias.Application.Interfaces;
using NeyBaterias.Domain.Entities;

namespace NeyBaterias.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OperadorController : ControllerBase
{
    private readonly IUnitOfWork _uow;

    public OperadorController(IUnitOfWork uow) => _uow = uow;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Operador>>> GetAll() =>
        Ok(await _uow.Operador.GetAllAsync());

    [HttpGet("{id:int}")]
    public async Task<ActionResult<Operador>> GetById(int id)
    {
        var operador = await _uow.Operador.GetByIdAsync(id);
        return operador is null ? NotFound() : Ok(operador);
    }

    [HttpPost]
    public async Task<ActionResult<Operador>> Create(Operador operador)
    {
        // Nunca salvamos a senha em texto puro — gera o hash antes de persistir
        operador.Senha = BCrypt.Net.BCrypt.HashPassword(operador.Senha);

        await _uow.Operador.AddAsync(operador);
        await _uow.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = operador.IdOperador }, operador);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, Operador operador)
    {
        if (id != operador.IdOperador) return BadRequest();

        var existente = await _uow.Operador.GetByIdAsync(id);
        if (existente is null) return NotFound();

        _uow.Operador.Update(operador);
        await _uow.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var operador = await _uow.Operador.GetByIdAsync(id);
        if (operador is null) return NotFound();

        _uow.Operador.Remove(operador);
        await _uow.SaveChangesAsync();
        return NoContent();
    }
}