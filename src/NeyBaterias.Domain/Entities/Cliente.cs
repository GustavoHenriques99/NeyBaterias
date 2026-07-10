namespace NeyBaterias.Domain.Entities;

/// <summary>
/// Entidade base do cliente. Especializada em ClienteFisico OU ClienteJuridico (1:1 opcional).
/// </summary>
public class Cliente
{
    public int IdCliente { get; set; }
    public DateOnly DataCadastro { get; set; }
    public bool Ativo { get; set; } = true;

    public ClienteFisico? ClienteFisico { get; set; }
    public ClienteJuridico? ClienteJuridico { get; set; }

    public ICollection<Venda> Vendas { get; set; } = new List<Venda>();
}
