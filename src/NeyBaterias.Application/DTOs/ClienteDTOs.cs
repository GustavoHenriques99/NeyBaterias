using System.ComponentModel.DataAnnotations;

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
    public DateOnly? DataNascimento { get; set; }
    public string? Telefone { get; set; }
    public string? Cep { get; set; }
    public string? Endereco { get; set; }
    public string? Numero { get; set; }
    public string? Complemento { get; set; }
    public string? Cidade { get; set; }

    // Preenchido só se for Pessoa Jurídica
    public string? Cnpj { get; set; }
    public string? RazaoSocial { get; set; }
    public string? NomeFantasia { get; set; }
    public string? Ie { get; set; }
    public string? ImTelefone { get; set; }
    public string? TelCelular { get; set; }
}


public class CriarClienteFisicoDto
{
    public string? Cpf { get; set; }

    [Required(ErrorMessage = "Nome é obrigatório.")]
    public string Nome { get; set; } = string.Empty;

    public string? Email { get; set; }
    public DateOnly? DataNascimento { get; set; }
    public string? Telefone { get; set; }
    public string? Cep { get; set; }

    [Required(ErrorMessage = "Endereço é obrigatório.")]
    public string Endereco { get; set; } = string.Empty;

    [Required(ErrorMessage = "Número é obrigatório.")]
    public string Numero { get; set; } = string.Empty;

    public string? Complemento { get; set; }

    public string? Cidade { get; set; }
}

public class CriarClienteJuridicoDto
{
    public string? Cnpj { get; set; }

    [Required(ErrorMessage = "Razão Social é obrigatória.")]
    public string RazaoSocial { get; set; } = string.Empty;

    public string? NomeFantasia { get; set; }
    public string? Ie { get; set; }
    public string? ImTelefone { get; set; }
    public string? TelCelular { get; set; }
}

public class AtualizarClienteFisicoDto
{
    public string? Cpf { get; set; }

    [Required(ErrorMessage = "Nome é obrigatório.")]
    public string Nome { get; set; } = string.Empty;

    public string? Email { get; set; }
    public DateOnly? DataNascimento { get; set; }
    public string? Telefone { get; set; }
    public string? Cep { get; set; }

    [Required(ErrorMessage = "Endereço é obrigatório.")]
    public string Endereco { get; set; } = string.Empty;

    [Required(ErrorMessage = "Número é obrigatório.")]
    public string Numero { get; set; } = string.Empty;

    public string? Complemento { get; set; }

    public string? Cidade { get; set; }
}

public class AtualizarClienteJuridicoDto
{
    public string? Cnpj { get; set; }

    [Required(ErrorMessage = "Razão Social é obrigatória.")]
    public string RazaoSocial { get; set; } = string.Empty;

    public string? NomeFantasia { get; set; }
    public string? Ie { get; set; }
    public string? ImTelefone { get; set; }
    public string? TelCelular { get; set; }
}