using NeyBaterias.Application.DTOs;

namespace NeyBaterias.Application.Interfaces;

public interface IAuthService
{
    Task<LoginRespostaDto?> LoginAsync(LoginDto dto);
}