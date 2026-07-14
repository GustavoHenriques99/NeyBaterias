using NeyBaterias.Application.DTOs;
using NeyBaterias.Domain.Entities;

namespace NeyBaterias.Application.Interfaces;

public interface IVendaService
{
    /// <summary>
    /// Registra a venda, calcula o total e gera automaticamente as saídas de estoque
    /// para cada item vendido que seja um Produto.
    /// </summary>
    Task<Venda> RegistrarVendaAsync(CriarVendaDto dto);
    Task ExcluirVendaAsync(int idVenda);
}
