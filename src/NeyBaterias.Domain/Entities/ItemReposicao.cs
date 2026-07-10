namespace NeyBaterias.Domain.Entities;

public class ItemReposicao
{
    public int IdItemReposicao { get; set; }
    public int Qtd { get; set; }
    public decimal PrecoCompra { get; set; }

    public int IdReposicao { get; set; }
    public CompraReposicao CompraReposicao { get; set; } = null!;

    public int IdProduto { get; set; }
    public Produto Produto { get; set; } = null!;

    public Estoque? MovimentoEstoque { get; set; }
}
