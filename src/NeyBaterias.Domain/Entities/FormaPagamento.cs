namespace NeyBaterias.Domain.Entities;

public class FormaPagamento
{
    public int IdPagamento { get; set; }
    public string Descricao { get; set; } = string.Empty;

    public ICollection<Venda> Vendas { get; set; } = new List<Venda>();
}
