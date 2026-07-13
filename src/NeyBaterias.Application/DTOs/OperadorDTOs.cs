namespace NeyBaterias.Application.DTOs;

public class OperadorRespostaDto
{
    public int IdOperador { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string Sobrenome { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string TelCelular { get; set; } = string.Empty;
    public string Login { get; set; } = string.Empty;
    public string Cargo { get; set; } = string.Empty;
    public int NivelAcesso { get; set; }
    public bool Ativo { get; set; }
}

// Usado para criar/editar dados cadastrais — nunca inclui a senha.
// Trocar a senha é uma ação separada (AlterarSenhaDto), por segurança.
public class AtualizarOperadorDto
{
    public string Nome { get; set; } = string.Empty;
    public string Sobrenome { get; set; } = string.Empty;
    public DateOnly DataNascimento { get; set; }
    public string Sexo { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string TelCelular { get; set; } = string.Empty;
    public string Login { get; set; } = string.Empty;
    public string Cargo { get; set; } = string.Empty;
    public int NivelAcesso { get; set; }
}

public class CriarOperadorDto
{
    public string Nome { get; set; } = string.Empty;
    public string Sobrenome { get; set; } = string.Empty;
    public DateOnly DataNascimento { get; set; }
    public string Sexo { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string TelCelular { get; set; } = string.Empty;
    public string Login { get; set; } = string.Empty;
    public string Senha { get; set; } = string.Empty;
    public string Cargo { get; set; } = string.Empty;
    public int NivelAcesso { get; set; }
}

public class AlterarSenhaDto
{
    public string SenhaAtual { get; set; } = string.Empty;
    public string NovaSenha { get; set; } = string.Empty;
}