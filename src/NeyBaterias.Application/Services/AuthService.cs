using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using NeyBaterias.Application.DTOs;
using NeyBaterias.Application.Interfaces;

namespace NeyBaterias.Application.Services;

public class AuthService : IAuthService
{
    private readonly IUnitOfWork _uow;
    private readonly IConfiguration _configuration;

    public AuthService(IUnitOfWork uow, IConfiguration configuration)
    {
        _uow = uow;
        _configuration = configuration;
    }

    public async Task<LoginRespostaDto?> LoginAsync(LoginDto dto)
    {
        var operadores = await _uow.Operador.FindAsync(o => o.Login == dto.Login);
        var operador = operadores.FirstOrDefault();

        if (operador is null || !operador.Ativo)
            return null;

        var senhaValida = BCrypt.Net.BCrypt.Verify(dto.Senha, operador.Senha);
        if (!senhaValida)
            return null;

        var token = GerarToken(operador.IdOperador, operador.Login, operador.NivelAcesso);

        return new LoginRespostaDto
        {
            Token = token,
            Nome = operador.Nome,
            Cargo = operador.Cargo,
            NivelAcesso = operador.NivelAcesso
        };
    }

    private string GerarToken(int idOperador, string login, int nivelAcesso)
    {
        var chave = _configuration["Jwt:Key"]!;
        var issuer = _configuration["Jwt:Issuer"];
        var audience = _configuration["Jwt:Audience"];
        var minutos = int.Parse(_configuration["Jwt:ExpiraEmMinutos"]!);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, idOperador.ToString()),
            new Claim(ClaimTypes.Name, login),
            new Claim("nivelAcesso", nivelAcesso.ToString())
        };

        var credenciais = new SigningCredentials(
            new SymmetricSecurityKey(Encoding.UTF8.GetBytes(chave)),
            SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(minutos),
            signingCredentials: credenciais);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public async Task<OperadorRespostaDto?> ObterPerfilAsync(int idOperador)
{
    var operador = await _uow.Operador.GetByIdAsync(idOperador);
    if (operador is null) return null;

    return new OperadorRespostaDto
    {
        IdOperador = operador.IdOperador,
        Nome = operador.Nome,
        Sobrenome = operador.Sobrenome,
        Email = operador.Email,
        TelCelular = operador.TelCelular,
        Login = operador.Login,
        Cargo = operador.Cargo,
        NivelAcesso = operador.NivelAcesso,
        Ativo = operador.Ativo
    };
}

public async Task<bool> AlterarSenhaAsync(int idOperador, AlterarSenhaDto dto)
{
    var operador = await _uow.Operador.GetByIdAsync(idOperador);
    if (operador is null) return false;

    var senhaAtualValida = BCrypt.Net.BCrypt.Verify(dto.SenhaAtual, operador.Senha);
    if (!senhaAtualValida) return false;

    operador.Senha = BCrypt.Net.BCrypt.HashPassword(dto.NovaSenha);
    _uow.Operador.Update(operador);
    await _uow.SaveChangesAsync();

    return true;
}
}