namespace NeyBaterias.Domain.Entities;

public class Venda
{
    public int IdVenda { get; set; }
    public DateTime DataVenda { get; set; }
    public decimal PrecoVenda { get; set; }
    public decimal Desconto { get; set; }
    public decimal PrecoTotal { get; set; }

    public int IdCliente { get; set; }
    public Cliente Cliente { get; set; } = null!;

    public int IdOperador { get; set; }
    public Operador Operador { get; set; } = null!;

    public int IdPagamento { get; set; }
    public FormaPagamento FormaPagamento { get; set; } = null!;

    public ICollection<ItemVenda> ItensVenda { get; set; } = new List<ItemVenda>();


}
