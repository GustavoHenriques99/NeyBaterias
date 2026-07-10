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
