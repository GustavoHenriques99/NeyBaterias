namespace NeyBaterias.Domain.Entities
{
    // Esta classe representa a tabela "usuario" no BANCO.
    // A class se refere ao operador/ funcionario do sistema não  ao Cliente!!!
    public class Operador
    {
    public int IdOperador { get; set; }
    public string Nome { get; set; } = string.Empty; //String.Empty para evitar nulls, garante que a propriedade sempre terá um valor inicial
    public string Sobrenome { get; set; } = string.Empty;
    public DateOnly DataNascimento { get; set; }
    public string Sexo { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string TelCelular { get; set; } = string.Empty;
    public string Login { get; set; } = string.Empty;
    public string Senha { get; set; } = string.Empty; // armazenar sempre com hash (ex: BCrypt)
    public DateOnly DataAdmissao { get; set; }
    public string Cargo { get; set; } = string.Empty;
    public int NivelAcesso { get; set; }
    public bool Ativo { get; set; } = true;

    public ICollection<Venda> Vendas { get; set; } = new List<Venda>(); // Relacionamento 1:N com a entidade Venda
    }
}