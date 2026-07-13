using NeyBaterias.Application.Interfaces;
using NeyBaterias.Domain.Entities;
using NeyBaterias.Infrastructure.Data;

namespace NeyBaterias.Infrastructure.Repositories;

public class UnitOfWork : IUnitOfWork
{
    private readonly NeyBateriasDbContext _context;

    public UnitOfWork(NeyBateriasDbContext context)
    {
        _context = context;

        Operador = new Repository<Operador>(_context);
        Clientes = new Repository<Cliente>(_context);
        ClientesFisicos = new Repository<ClienteFisico>(_context);
        ClientesJuridicos = new Repository<ClienteJuridico>(_context);
        Fornecedores = new Repository<Fornecedor>(_context);
        Itens = new Repository<Item>(_context);
        Produtos = new Repository<Produto>(_context);
        Servicos = new Repository<Servico>(_context);
        FormasPagamento = new Repository<FormaPagamento>(_context);
        Vendas = new Repository<Venda>(_context);
        ItensVenda = new Repository<ItemVenda>(_context);
        ComprasReposicao = new Repository<CompraReposicao>(_context);
        ItensReposicao = new Repository<ItemReposicao>(_context);
        Estoques = new Repository<Estoque>(_context);
        ConfiguracaoEmpresa = new Repository<ConfiguracaoEmpresa>(_context);
    }

    public IRepository<Operador> Operador { get; }
    public IRepository<Cliente> Clientes { get; }
    public IRepository<ClienteFisico> ClientesFisicos { get; }
    public IRepository<ClienteJuridico> ClientesJuridicos { get; }
    public IRepository<Fornecedor> Fornecedores { get; }
    public IRepository<Item> Itens { get; }
    public IRepository<Produto> Produtos { get; }
    public IRepository<Servico> Servicos { get; }
    public IRepository<FormaPagamento> FormasPagamento { get; }
    public IRepository<Venda> Vendas { get; }
    public IRepository<ItemVenda> ItensVenda { get; }
    public IRepository<CompraReposicao> ComprasReposicao { get; }
    public IRepository<ItemReposicao> ItensReposicao { get; }
    public IRepository<Estoque> Estoques { get; }
    public IRepository<ConfiguracaoEmpresa> ConfiguracaoEmpresa { get; }
    

    public async Task<int> SaveChangesAsync() => await _context.SaveChangesAsync();
}
