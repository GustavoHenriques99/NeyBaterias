namespace NeyBaterias.Domain.Entities;

// Tabela "singleton": guarda uma única linha (Id = 1) com os dados gerais da empresa.
public class ConfiguracaoEmpresa
{
    public int Id { get; set; }
    public string NomeEmpresa { get; set; } = string.Empty;
    public string Cnpj { get; set; } = string.Empty;
    public string Endereco { get; set; } = string.Empty;
    public string Telefone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
}