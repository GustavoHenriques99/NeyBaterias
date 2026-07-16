namespace NeyBaterias.Domain.Entities;

public class ClienteFisico
{
    public int IdClienteFisico { get; set; }
    public string? Cpf { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string? Email { get; set; }
    public DateOnly? DataNascimento { get; set; }
    public string? Telefone { get; set; }
    public string? Cep { get; set; }
    public string Endereco { get; set; } = string.Empty;
    public string Numero { get; set; } = string.Empty;
    public string? Complemento { get; set; }
    public string Cidade { get; set; } = string.Empty;

    public int IdCliente { get; set; }
    public Cliente Cliente { get; set; } = null!;
}
