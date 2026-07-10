using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NeyBaterias.Application.Interfaces;
using NeyBaterias.Domain.Entities;

namespace NeyBaterias.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ClientesController : ControllerBase
{
    private readonly IUnitOfWork _uow;

    public ClientesController(IUnitOfWork uow) => _uow = uow;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Cliente>>> GetAll() =>
        Ok(await _uow.Clientes.Query()
            .Include(c => c.ClienteFisico)
            .Include(c => c.ClienteJuridico)
            .ToListAsync());

    [HttpGet("{id:int}")]
    public async Task<ActionResult<Cliente>> GetById(int id)
    {
        var cliente = await _uow.Clientes.Query()
            .Include(c => c.ClienteFisico)
            .Include(c => c.ClienteJuridico)
            .FirstOrDefaultAsync(c => c.IdCliente == id);

        return cliente is null ? NotFound() : Ok(cliente);
    }

    // Cria um cliente Pessoa Física (Cliente + ClienteFisico em uma única operação)
    [HttpPost("fisico")]
    public async Task<ActionResult<Cliente>> CreateFisico(ClienteFisico clienteFisico)
    {
        var cliente = new Cliente
        {
            DataCadastro = DateOnly.FromDateTime(DateTime.UtcNow),
            Ativo = true,
            ClienteFisico = clienteFisico
        };

        await _uow.Clientes.AddAsync(cliente);
        await _uow.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = cliente.IdCliente }, cliente);
    }

    // Cria um cliente Pessoa Jurídica (Cliente + ClienteJuridico em uma única operação)
    [HttpPost("juridico")]
    public async Task<ActionResult<Cliente>> CreateJuridico(ClienteJuridico clienteJuridico)
    {
        var cliente = new Cliente
        {
            DataCadastro = DateOnly.FromDateTime(DateTime.UtcNow),
            Ativo = true,
            ClienteJuridico = clienteJuridico
        };

        await _uow.Clientes.AddAsync(cliente);
        await _uow.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = cliente.IdCliente }, cliente);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var cliente = await _uow.Clientes.GetByIdAsync(id);
        if (cliente is null) return NotFound();

        _uow.Clientes.Remove(cliente);
        await _uow.SaveChangesAsync();
        return NoContent();
    }
}
