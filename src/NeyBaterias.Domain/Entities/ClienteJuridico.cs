namespace NeyBaterias.Domain.Entities;

public class ClienteJuridico
{
    public int IdClienteJuridico { get; set; }
    public string? Cnpj { get; set; }
    public string RazaoSocial { get; set; } = string.Empty;
    public string? NomeFantasia { get; set; }
    public string? Ie { get; set; }
    public string? ImTelefone { get; set; }
    public string? TelCelular { get; set; }

    public int IdCliente { get; set; }
    public Cliente Cliente { get; set; } = null!;
}
