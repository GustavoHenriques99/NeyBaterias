namespace NeyBaterias.Application.DTOs;

public class ClienteRespostaDto
{
    public int IdCliente { get; set; }
    public DateOnly DataCadastro { get; set; }
    public bool Ativo { get; set; }
    public string Tipo { get; set; } = string.Empty; // "Fisico" ou "Juridico"

    // Preenchido só se for Pessoa Física
    public string? Cpf { get; set; }
    public string? Nome { get; set; }
    public string? Email { get; set; }
    public string? Telefone { get; set; }
    public string? Cidade { get; set; }

    // Preenchido só se for Pessoa Jurídica
    public string? Cnpj { get; set; }
    public string? RazaoSocial { get; set; }
    public string? NomeFantasia { get; set; }
}