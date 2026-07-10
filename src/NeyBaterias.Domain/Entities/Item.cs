using NeyBaterias.Domain.Enums;

namespace NeyBaterias.Domain.Entities;


// Entidade genérica que representa algo vendável. Especializada em Produto OU Servico (1:1 opcional).
public class Item
{
    public int IdItem { get; set; }
    public string Descricao { get; set; } = string.Empty;
    public decimal Valor { get; set; }
    public TipoItem Tipo { get; set; }
    public bool Ativo { get; set; } = true;

    public Produto? Produto { get; set; }
    public Servico? Servico { get; set; }

    public ICollection<ItemVenda> ItensVenda { get; set; } = new List<ItemVenda>();
}
