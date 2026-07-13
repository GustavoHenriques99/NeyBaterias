using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NeyBaterias.Application.DTOs;
using NeyBaterias.Application.Interfaces;
using System.Security.Claims;

namespace NeyBaterias.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService) => _authService = authService;

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto dto)
    {
        var resposta = await _authService.LoginAsync(dto);

        if (resposta is null)
            return Unauthorized(new { erro = "Login ou senha inválidos." });

        return Ok(resposta);
    }


    [Authorize]
    [HttpGet("me")]
    public async Task<IActionResult> Me()
    {
        var idOperador = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var perfil = await _authService.ObterPerfilAsync(idOperador);
        return perfil is null ? NotFound() : Ok(perfil);
    }

    [Authorize]
    [HttpPut("me/senha")]
    public async Task<IActionResult> AlterarMinhaSenha(AlterarSenhaDto dto)
    {
        var idOperador = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var sucesso = await _authService.AlterarSenhaAsync(idOperador, dto);

        return sucesso ? NoContent() : BadRequest(new { erro = "Senha atual incorreta." });
    }

}