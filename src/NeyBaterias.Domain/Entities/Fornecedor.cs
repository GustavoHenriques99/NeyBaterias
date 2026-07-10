namespace NeyBaterias.Domain.Entities;

public class Fornecedor
{
    public int IdFornecedor { get; set; }
    public string RazaoSocial { get; set; } = string.Empty;
    public string Cnpj { get; set; } = string.Empty;
    public string Telefone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Endereco { get; set; } = string.Empty;
    public string Contato { get; set; } = string.Empty;

    public ICollection<CompraReposicao> ComprasReposicao { get; set; } = new List<CompraReposicao>();
}
