using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NeyBaterias.Application.DTOs;
using NeyBaterias.Application.Interfaces;
using NeyBaterias.Domain.Entities;

namespace NeyBaterias.API.Controllers;

[Authorize(Policy = "Administrador")]
[ApiController]
[Route("api/[controller]")]
public class OperadorController : ControllerBase
{
    private readonly IUnitOfWork _uow;

    public OperadorController(IUnitOfWork uow) => _uow = uow;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<OperadorRespostaDto>>> GetAll()
    {
        var operadores = await _uow.Operador.GetAllAsync();
        return Ok(operadores.Select(MapearParaDto));
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<OperadorRespostaDto>> GetById(int id)
    {
        var operador = await _uow.Operador.GetByIdAsync(id);
        return operador is null ? NotFound() : Ok(MapearParaDto(operador));
    }

    [HttpPost]
    public async Task<ActionResult<OperadorRespostaDto>> Create(CriarOperadorDto dto)
    {
        var operador = new Operador
        {
            Nome = dto.Nome,
            Sobrenome = dto.Sobrenome,
            DataNascimento = dto.DataNascimento,
            Sexo = dto.Sexo,
            Email = dto.Email,
            TelCelular = dto.TelCelular,
            Login = dto.Login,
            Senha = BCrypt.Net.BCrypt.HashPassword(dto.Senha),
            DataAdmissao = DateOnly.FromDateTime(DateTime.UtcNow),
            Cargo = dto.Cargo,
            NivelAcesso = dto.NivelAcesso,
            Ativo = true
        };

        await _uow.Operador.AddAsync(operador);
        await _uow.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = operador.IdOperador }, MapearParaDto(operador));
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, AtualizarOperadorDto dto)
    {
        var operador = await _uow.Operador.GetByIdAsync(id);
        if (operador is null) return NotFound();

        operador.Nome = dto.Nome;
        operador.Sobrenome = dto.Sobrenome;
        operador.DataNascimento = dto.DataNascimento;
        operador.Sexo = dto.Sexo;
        operador.Email = dto.Email;
        operador.TelCelular = dto.TelCelular;
        operador.Login = dto.Login;
        operador.Cargo = dto.Cargo;
        operador.NivelAcesso = dto.NivelAcesso;
        // Repare: a senha NUNCA é tocada aqui — só pelo endpoint dedicado de troca de senha.

        _uow.Operador.Update(operador);
        await _uow.SaveChangesAsync();
        return NoContent();
    }

    [HttpPut("{id:int}/ativar")]
    public async Task<IActionResult> Ativar(int id) => await AlterarStatus(id, true);

    [HttpPut("{id:int}/desativar")]
    public async Task<IActionResult> Desativar(int id) => await AlterarStatus(id, false);

    private async Task<IActionResult> AlterarStatus(int id, bool ativo)
    {
        var operador = await _uow.Operador.GetByIdAsync(id);
        if (operador is null) return NotFound();

        operador.Ativo = ativo;
        _uow.Operador.Update(operador);
        await _uow.SaveChangesAsync();
        return NoContent();
    }

    private static OperadorRespostaDto MapearParaDto(Operador o) => new()
    {
        IdOperador = o.IdOperador,
        Nome = o.Nome,
        Sobrenome = o.Sobrenome,
        Email = o.Email,
        TelCelular = o.TelCelular,
        Login = o.Login,
        Cargo = o.Cargo,
        NivelAcesso = o.NivelAcesso,
        Ativo = o.Ativo
    };
}