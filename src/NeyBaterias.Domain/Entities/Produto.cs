namespace NeyBaterias.Domain.Entities;

public class Produto
{
    public int IdProduto { get; set; }
    public string Descricao { get; set; } = string.Empty;
    public string Amperagem { get; set; } = string.Empty;
    public string Marca { get; set; } = string.Empty;
    public string Modelo { get; set; } = string.Empty;
    public decimal PrecoCusto { get; set; }
    public decimal PrecoVenda { get; set; }

    public int IdItem { get; set; }
    public Item Item { get; set; } = null!;

    public ICollection<ItemReposicao> ItensReposicao { get; set; } = new List<ItemReposicao>();
    public ICollection<Estoque> MovimentosEstoque { get; set; } = new List<Estoque>();
}
