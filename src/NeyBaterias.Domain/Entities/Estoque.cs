using NeyBaterias.Domain.Enums;

namespace NeyBaterias.Domain.Entities;

public class Estoque
{
    public int IdEstoque { get; set; }
    public int QtdMovimento { get; set; }
    public TipoMovimentoEstoque TipoMovimento { get; set; } // esse campo indica se o movimento é uma ENTRADA ou uma SAÍDA de estoque

    public int IdProduto { get; set; }
    public Produto Produto { get; set; } = null!;

    // Preenchido quando o movimento é uma SAÍDA originada por uma venda
    public int? IdItemVenda { get; set; }
    public ItemVenda? ItemVenda { get; set; }

    // Preenchido quando o movimento é uma ENTRADA originada por uma reposição
    public int? IdItemReposicao { get; set; }
    public ItemReposicao? ItemReposicao { get; set; }

    public DateTime DataMovimento { get; set; } = DateTime.UtcNow;  // Preenchido automaticamente com a data e hora atual no momento da criação do registro
}
