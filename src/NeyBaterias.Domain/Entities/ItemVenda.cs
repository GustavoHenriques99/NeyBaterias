namespace NeyBaterias.Domain.Entities;

public class ItemVenda
{
    public int IdItemVenda { get; set; }
    public int Qtd { get; set; }
    public decimal PrecoVenda { get; set; }

    public int IdVenda { get; set; }
    public Venda Venda { get; set; } = null!;

    public int IdItem { get; set; }
    public Item Item { get; set; } = null!;

    // Presente somente quando o item vendido é um Produto (gera saída de estoque)
    public Estoque? MovimentoEstoque { get; set; }
}
