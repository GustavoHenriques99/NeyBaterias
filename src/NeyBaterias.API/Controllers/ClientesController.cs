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
                Cpf = Normalizar(dto.Cpf),
                Nome = dto.Nome,
                Email = Normalizar(dto.Email),
                DataNascimento = dto.DataNascimento,
                Telefone = Normalizar(dto.Telefone),
                Cep = Normalizar(dto.Cep),
                Endereco = dto.Endereco,
                Numero = dto.Numero,
                Complemento = Normalizar(dto.Complemento),
                Cidade = Normalizar(dto.Cidade)
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
                Cnpj = Normalizar(dto.Cnpj),
                RazaoSocial = dto.RazaoSocial,
                NomeFantasia = Normalizar(dto.NomeFantasia),
                Ie = Normalizar(dto.Ie),
                ImTelefone = Normalizar(dto.ImTelefone),
                TelCelular = Normalizar(dto.TelCelular)
            }
        };

        await _uow.Clientes.AddAsync(cliente);
        await _uow.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = cliente.IdCliente }, MapearParaDto(cliente));
    }

    [HttpPut("fisico/{id:int}")]
    public async Task<IActionResult> UpdateFisico(int id, AtualizarClienteFisicoDto dto)
    {
        var cliente = await _uow.Clientes.Query()
            .Include(c => c.ClienteFisico)
            .FirstOrDefaultAsync(c => c.IdCliente == id);

        if (cliente is null || cliente.ClienteFisico is null) return NotFound();

        cliente.ClienteFisico.Cpf = Normalizar(dto.Cpf);
        cliente.ClienteFisico.Nome = dto.Nome;
        cliente.ClienteFisico.Email = Normalizar(dto.Email);
        cliente.ClienteFisico.DataNascimento = dto.DataNascimento;
        cliente.ClienteFisico.Telefone = Normalizar(dto.Telefone);
        cliente.ClienteFisico.Cep = Normalizar(dto.Cep);
        cliente.ClienteFisico.Endereco = dto.Endereco;
        cliente.ClienteFisico.Numero = dto.Numero;
        cliente.ClienteFisico.Complemento = Normalizar(dto.Complemento);
        cliente.ClienteFisico.Cidade = Normalizar(dto.Cidade);

        await _uow.SaveChangesAsync();
        return NoContent();
    }

    [HttpPut("juridico/{id:int}")]
    public async Task<IActionResult> UpdateJuridico(int id, AtualizarClienteJuridicoDto dto)
    {
        var cliente = await _uow.Clientes.Query()
            .Include(c => c.ClienteJuridico)
            .FirstOrDefaultAsync(c => c.IdCliente == id);

        if (cliente is null || cliente.ClienteJuridico is null) return NotFound();

        cliente.ClienteJuridico.Cnpj = Normalizar(dto.Cnpj);
        cliente.ClienteJuridico.RazaoSocial = dto.RazaoSocial;
        cliente.ClienteJuridico.NomeFantasia = Normalizar(dto.NomeFantasia);
        cliente.ClienteJuridico.Ie = Normalizar(dto.Ie);
        cliente.ClienteJuridico.ImTelefone = Normalizar(dto.ImTelefone);
        cliente.ClienteJuridico.TelCelular = Normalizar(dto.TelCelular);

        await _uow.SaveChangesAsync();
        return NoContent();
    }

    [HttpPut("{id:int}/ativar")]
    public async Task<IActionResult> Ativar(int id) => await AlterarStatus(id, true);

    [HttpPut("{id:int}/desativar")]
    public async Task<IActionResult> Desativar(int id) => await AlterarStatus(id, false);

    private async Task<IActionResult> AlterarStatus(int id, bool ativo)
    {
        var cliente = await _uow.Clientes.GetByIdAsync(id);
        if (cliente is null) return NotFound();

        cliente.Ativo = ativo;
        _uow.Clientes.Update(cliente);
        await _uow.SaveChangesAsync();
        return NoContent();
    }

    // Campos opcionais com índice único (Cpf/Cnpj) precisam virar NULL quando vazios,
    // senão duas strings vazias ("") batem na constraint UNIQUE do banco.
    private static string? Normalizar(string? valor) =>
        string.IsNullOrWhiteSpace(valor) ? null : valor.Trim();


    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var cliente = await _uow.Clientes.GetByIdAsync(id);
        if (cliente is null) return NotFound();

        _uow.Clientes.Remove(cliente);

        try
        {
            await _uow.SaveChangesAsync();
        }
        catch (DbUpdateException)
        {
            return Conflict(new { erro = "Não é possível excluir: este cliente possui vendas registradas. Inative-o em vez de excluir." });
        }

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
                DataNascimento = cliente.ClienteFisico.DataNascimento,
                Telefone = cliente.ClienteFisico.Telefone,
                Cep = cliente.ClienteFisico.Cep,
                Endereco = cliente.ClienteFisico.Endereco,
                Numero = cliente.ClienteFisico.Numero,
                Complemento = cliente.ClienteFisico.Complemento,
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
                NomeFantasia = cliente.ClienteJuridico.NomeFantasia,
                Ie = cliente.ClienteJuridico.Ie,
                ImTelefone = cliente.ClienteJuridico.ImTelefone,
                TelCelular = cliente.ClienteJuridico.TelCelular
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