namespace NeyBaterias.Application.DTOs;

public class CriarCompraReposicaoDto
{
    public int IdFornecedor { get; set; }
    public List<CriarItemReposicaoDto> Itens { get; set; } = new();
}

public class CriarItemReposicaoDto
{
    public int IdProduto { get; set; }
    public int Qtd { get; set; }
    public decimal PrecoCompra { get; set; }
}
