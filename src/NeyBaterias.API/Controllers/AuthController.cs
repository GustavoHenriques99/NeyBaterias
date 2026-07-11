using Microsoft.AspNetCore.Mvc;
using NeyBaterias.Application.DTOs;
using NeyBaterias.Application.Interfaces;

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
}