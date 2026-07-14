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


public class CriarClienteFisicoDto
{
    public string Cpf { get; set; } = string.Empty;
    public string Nome { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public DateOnly DataNascimento { get; set; }
    public string Telefone { get; set; } = string.Empty;
    public string Cep { get; set; } = string.Empty;
    public string Endereco { get; set; } = string.Empty;
    public string Numero { get; set; } = string.Empty;
    public string? Complemento { get; set; }
    public string Cidade { get; set; } = string.Empty;
}

public class CriarClienteJuridicoDto
{
    public string Cnpj { get; set; } = string.Empty;
    public string RazaoSocial { get; set; } = string.Empty;
    public string NomeFantasia { get; set; } = string.Empty;
    public string Ie { get; set; } = string.Empty;
    public string ImTelefone { get; set; } = string.Empty;
    public string TelCelular { get; set; } = string.Empty;
}