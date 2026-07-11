namespace NeyBaterias.Application.DTOs;

public class CriarVendaDto
{
    public int IdCliente { get; set; }
    public int IdOperador { get; set; }
    public int IdPagamento { get; set; }
    public decimal Desconto { get; set; }
    public List<CriarItemVendaDto> Itens { get; set; } = new();
}

public class CriarItemVendaDto
{
    public int IdItem { get; set; }
    public int Qtd { get; set; }
    public decimal PrecoVenda { get; set; }
}

public class VendaRespostaDto
{
    public int IdVenda { get; set; }
    public DateTime DataVenda { get; set; }
    public decimal PrecoVenda { get; set; }
    public decimal Desconto { get; set; }
    public decimal PrecoTotal { get; set; }
    public string ClienteNome { get; set; } = string.Empty;
    public string OperadorNome { get; set; } = string.Empty;
    public string FormaPagamentoDescricao { get; set; } = string.Empty;
    public List<ItemVendaRespostaDto> Itens { get; set; } = new();
}

public class ItemVendaRespostaDto
{
    public int IdItemVenda { get; set; }
    public int IdItem { get; set; }
    public string Descricao { get; set; } = string.Empty;
    public int Qtd { get; set; }
    public decimal PrecoVenda { get; set; }
}