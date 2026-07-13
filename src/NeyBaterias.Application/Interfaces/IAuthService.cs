using NeyBaterias.Application.DTOs;

namespace NeyBaterias.Application.Interfaces;

public interface IAuthService
{
    Task<LoginRespostaDto?> LoginAsync(LoginDto dto);
    Task<OperadorRespostaDto?> ObterPerfilAsync(int idOperador);
    Task<bool> AlterarSenhaAsync(int idOperador, AlterarSenhaDto dto);
}