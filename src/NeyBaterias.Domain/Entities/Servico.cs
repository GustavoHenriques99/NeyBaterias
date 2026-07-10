namespace NeyBaterias.Domain.Entities;

public class Servico
{
    public int IdServico { get; set; }
    public string Descricao { get; set; } = string.Empty;
    public decimal Preco { get; set; }
    public int TempoEstimado { get; set; } //vai trazer em minutos

    public int IdItem { get; set; }
    public Item Item { get; set; } = null!;
}
