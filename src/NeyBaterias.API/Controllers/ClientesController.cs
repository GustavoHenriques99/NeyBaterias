using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using NeyBaterias.Application.DTOs;
using NeyBaterias.Application.Interfaces;
using NeyBaterias.Domain.Entities;

namespace NeyBaterias.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class ClientesController : ControllerBase
{
    private readonly IUnitOfWork _uow;

    public ClientesController(IUnitOfWork uow) => _uow = uow;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ClienteRespostaDto>>> GetAll()
    {
        var clientes = await _uow.Clientes.Query()
            .Include(c => c.ClienteFisico)
            .Include(c => c.ClienteJuridico)
            .ToListAsync();

        return Ok(clientes.Select(MapearParaDto));
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<ClienteRespostaDto>> GetById(int id)
    {
        var cliente = await _uow.Clientes.Query()
            .Include(c => c.ClienteFisico)
            .Include(c => c.ClienteJuridico)
            .FirstOrDefaultAsync(c => c.IdCliente == id);

        return cliente is null ? NotFound() : Ok(MapearParaDto(cliente));
    }

    [HttpPost("fisico")]
    public async Task<ActionResult<ClienteRespostaDto>> CreateFisico(CriarClienteFisicoDto dto)
    {
        var cliente = new Cliente
        {
            DataCadastro = DateOnly.FromDateTime(DateTime.UtcNow),
            Ativo = true,
            ClienteFisico = new ClienteFisico
            {
                Cpf = dto.Cpf,
                Nome = dto.Nome,
                Email = dto.Email,
                DataNascimento = dto.DataNascimento,
                Telefone = dto.Telefone,
                Cep = dto.Cep,
                Endereco = dto.Endereco,
                Numero = dto.Numero,
                Complemento = dto.Complemento,
                Cidade = dto.Cidade
            }
        };

        await _uow.Clientes.AddAsync(cliente);
        await _uow.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = cliente.IdCliente }, MapearParaDto(cliente));
    }

    [HttpPost("juridico")]
    public async Task<ActionResult<ClienteRespostaDto>> CreateJuridico(CriarClienteJuridicoDto dto)
    {
        var cliente = new Cliente
        {
            DataCadastro = DateOnly.FromDateTime(DateTime.UtcNow),
            Ativo = true,
            ClienteJuridico = new ClienteJuridico
            {
                Cnpj = dto.Cnpj,
                RazaoSocial = dto.RazaoSocial,
                NomeFantasia = dto.NomeFantasia,
                Ie = dto.Ie,
                ImTelefone = dto.ImTelefone,
                TelCelular = dto.TelCelular
            }
        };

        await _uow.Clientes.AddAsync(cliente);
        await _uow.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = cliente.IdCliente }, MapearParaDto(cliente));
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

    private static ClienteRespostaDto MapearParaDto(Cliente cliente)
    {
        if (cliente.ClienteFisico is not null)
        {
            return new ClienteRespostaDto
            {
                IdCliente = cliente.IdCliente,
                DataCadastro = cliente.DataCadastro,
                Ativo = cliente.Ativo,
                Tipo = "Fisico",
                Cpf = cliente.ClienteFisico.Cpf,
                Nome = cliente.ClienteFisico.Nome,
                Email = cliente.ClienteFisico.Email,
                Telefone = cliente.ClienteFisico.Telefone,
                Cidade = cliente.ClienteFisico.Cidade
            };
        }

        if (cliente.ClienteJuridico is not null)
        {
            return new ClienteRespostaDto
            {
                IdCliente = cliente.IdCliente,
                DataCadastro = cliente.DataCadastro,
                Ativo = cliente.Ativo,
                Tipo = "Juridico",
                Cnpj = cliente.ClienteJuridico.Cnpj,
                RazaoSocial = cliente.ClienteJuridico.RazaoSocial,
                NomeFantasia = cliente.ClienteJuridico.NomeFantasia
            };
        }

        return new ClienteRespostaDto
        {
            IdCliente = cliente.IdCliente,
            DataCadastro = cliente.DataCadastro,
            Ativo = cliente.Ativo,
            Tipo = "Indefinido"
        };
    }
}