using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using NeyBaterias.Application.Interfaces;
using NeyBaterias.Domain.Entities;

namespace NeyBaterias.API.Controllers;

[Authorize(Policy = "Nivel1")]
[ApiController]
[Route("api/[controller]")]
public class FornecedoresController : ControllerBase
{
    private readonly IUnitOfWork _uow;

    public FornecedoresController(IUnitOfWork uow) => _uow = uow;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Fornecedor>>> GetAll() =>
        Ok(await _uow.Fornecedores.GetAllAsync());

    [HttpGet("{id:int}")]
    public async Task<ActionResult<Fornecedor>> GetById(int id)
    {
        var fornecedor = await _uow.Fornecedores.GetByIdAsync(id);
        return fornecedor is null ? NotFound() : Ok(fornecedor);
    }

    [Authorize(Policy = "Nivel2")]
    [HttpPost]
    public async Task<ActionResult<Fornecedor>> Create(Fornecedor fornecedor)
    {
        await _uow.Fornecedores.AddAsync(fornecedor);
        await _uow.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = fornecedor.IdFornecedor }, fornecedor);
    }

    [Authorize(Policy = "Nivel3")]
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, Fornecedor fornecedor)
    {
        if (id != fornecedor.IdFornecedor) return BadRequest();

        var existente = await _uow.Fornecedores.GetByIdAsync(id);
        if (existente is null) return NotFound();

        _uow.Fornecedores.Update(fornecedor);
        await _uow.SaveChangesAsync();
        return NoContent();
    }

    [Authorize(Policy = "Nivel3")]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var fornecedor = await _uow.Fornecedores.GetByIdAsync(id);
        if (fornecedor is null) return NotFound();

        _uow.Fornecedores.Remove(fornecedor);
        await _uow.SaveChangesAsync();
        return NoContent();
    }
}