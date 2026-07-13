using NeyBaterias.Domain.Entities;

namespace NeyBaterias.Application.Interfaces;

/// <summary>
/// Agrupa os repositórios e controla a persistência transacional (SaveChanges único).
/// </summary>
public interface IUnitOfWork
{
    IRepository<Operador> Operador { get; }
    IRepository<Cliente> Clientes { get; }
    IRepository<ClienteFisico> ClientesFisicos { get; }
    IRepository<ClienteJuridico> ClientesJuridicos { get; }
    IRepository<Fornecedor> Fornecedores { get; }
    IRepository<Item> Itens { get; }
    IRepository<Produto> Produtos { get; }
    IRepository<Servico> Servicos { get; }
    IRepository<FormaPagamento> FormasPagamento { get; }
    IRepository<Venda> Vendas { get; }
    IRepository<ItemVenda> ItensVenda { get; }
    IRepository<CompraReposicao> ComprasReposicao { get; }
    IRepository<ItemReposicao> ItensReposicao { get; }
    IRepository<Estoque> Estoques { get; }
    IRepository<ConfiguracaoEmpresa> ConfiguracaoEmpresa { get; }

    Task<int> SaveChangesAsync();
}
