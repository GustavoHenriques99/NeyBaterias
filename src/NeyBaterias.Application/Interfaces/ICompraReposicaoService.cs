using NeyBaterias.Application.DTOs;
using NeyBaterias.Domain.Entities;

namespace NeyBaterias.Application.Interfaces;

public interface ICompraReposicaoService
{
    /// <summary>
    /// Registra a compra de reposição e gera automaticamente as entradas de estoque
    /// para cada produto reposto.
    /// </summary>
    Task<CompraReposicao> RegistrarReposicaoAsync(CriarCompraReposicaoDto dto);
}
