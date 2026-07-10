namespace NeyBaterias.Domain.Entities;

public class CompraReposicao
{
    public int IdReposicao { get; set; }
    public DateTime DataReposicao { get; set; }
    public decimal Preco { get; set; }

    public int IdFornecedor { get; set; }
    public Fornecedor Fornecedor { get; set; } = null!;

    public ICollection<ItemReposicao> ItensReposicao { get; set; } = new List<ItemReposicao>();
}
