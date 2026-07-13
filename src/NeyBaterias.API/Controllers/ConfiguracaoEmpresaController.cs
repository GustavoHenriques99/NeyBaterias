using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NeyBaterias.Application.DTOs;
using NeyBaterias.Application.Interfaces;

namespace NeyBaterias.API.Controllers;

[Authorize(Policy = "Administrador")]
[ApiController]
[Route("api/[controller]")]
public class ConfiguracaoEmpresaController : ControllerBase
{
    private readonly IUnitOfWork _uow;

    public ConfiguracaoEmpresaController(IUnitOfWork uow) => _uow = uow;

    [HttpGet]
    public async Task<ActionResult<ConfiguracaoEmpresaDto>> Get()
    {
        var config = await _uow.ConfiguracaoEmpresa.GetByIdAsync(1);
        if (config is null) return NotFound();

        return Ok(new ConfiguracaoEmpresaDto
        {
            NomeEmpresa = config.NomeEmpresa,
            Cnpj = config.Cnpj,
            Endereco = config.Endereco,
            Telefone = config.Telefone,
            Email = config.Email
        });
    }

    [HttpPut]
    public async Task<IActionResult> Update(ConfiguracaoEmpresaDto dto)
    {
        var config = await _uow.ConfiguracaoEmpresa.GetByIdAsync(1);
        if (config is null) return NotFound();

        config.NomeEmpresa = dto.NomeEmpresa;
        config.Cnpj = dto.Cnpj;
        config.Endereco = dto.Endereco;
        config.Telefone = dto.Telefone;
        config.Email = dto.Email;

        _uow.ConfiguracaoEmpresa.Update(config);
        await _uow.SaveChangesAsync();
        return NoContent();
    }
}