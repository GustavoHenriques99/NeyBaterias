namespace NeyBaterias.Application.DTOs;

public class CriarProdutoDto
{
    public string Descricao { get; set; } = string.Empty;
    public decimal Valor { get; set; }
    public string Amperagem { get; set; } = string.Empty;
    public string Marca { get; set; } = string.Empty;
    public string Modelo { get; set; } = string.Empty;
    public decimal PrecoCusto { get; set; }
    public decimal PrecoVenda { get; set; }
}

public class CriarServicoDto
{
    public string Descricao { get; set; } = string.Empty;
    public decimal Valor { get; set; }
    public decimal Preco { get; set; }
    public int TempoEstimado { get; set; }
}

public class AtualizarServicoDto
{
    public string Descricao { get; set; } = string.Empty;
    public decimal Valor { get; set; }
    public decimal Preco { get; set; }
    public int TempoEstimado { get; set; }
}


public class ItemRespostaDto
{
    public int IdItem { get; set; }
    public string Descricao { get; set; } = string.Empty;
    public decimal Valor { get; set; }
    public string Tipo { get; set; } = string.Empty; // "Produto" ou "Servico"
}


public class AtualizarProdutoDto
{
    public string Descricao { get; set; } = string.Empty;
    public decimal Valor { get; set; }
    public string Amperagem { get; set; } = string.Empty;
    public string Marca { get; set; } = string.Empty;
    public string Modelo { get; set; } = string.Empty;
    public decimal PrecoCusto { get; set; }
    public decimal PrecoVenda { get; set; }
}