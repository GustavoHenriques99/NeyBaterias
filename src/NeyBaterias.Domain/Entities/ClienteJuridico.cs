namespace NeyBaterias.Domain.Entities;

public class ClienteJuridico
{
    public int IdClienteJuridico { get; set; }
    public string Cnpj { get; set; } = string.Empty;
    public string RazaoSocial { get; set; } = string.Empty;
    public string NomeFantasia { get; set; } = string.Empty;
    public string Ie { get; set; } = string.Empty;
    public string ImTelefone { get; set; } = string.Empty;
    public string TelCelular { get; set; } = string.Empty;

    public int IdCliente { get; set; }
    public Cliente Cliente { get; set; } = null!;
}
