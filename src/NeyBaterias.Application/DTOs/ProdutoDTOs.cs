namespace NeyBaterias.Application.DTOs;

public class ProdutoRespostaDto
{
    public int IdProduto { get; set; }
    public string Descricao { get; set; } = string.Empty;
    public string Amperagem { get; set; } = string.Empty;
    public string Marca { get; set; } = string.Empty;
    public string Modelo { get; set; } = string.Empty;
    public decimal PrecoCusto { get; set; }
    public decimal PrecoVenda { get; set; }
}