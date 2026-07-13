using Microsoft.EntityFrameworkCore;
using NeyBaterias.Domain.Entities;

namespace NeyBaterias.Infrastructure.Data;

public class NeyBateriasDbContext : DbContext
{
    public NeyBateriasDbContext(DbContextOptions<NeyBateriasDbContext> options) : base(options)
    {
    }

    public DbSet<Operador> Usuarios => Set<Operador>();
    public DbSet<Cliente> Clientes => Set<Cliente>();
    public DbSet<ClienteFisico> ClientesFisicos => Set<ClienteFisico>();
    public DbSet<ClienteJuridico> ClientesJuridicos => Set<ClienteJuridico>();
    public DbSet<Fornecedor> Fornecedores => Set<Fornecedor>();
    public DbSet<Item> Itens => Set<Item>();
    public DbSet<Produto> Produtos => Set<Produto>();
    public DbSet<Servico> Servicos => Set<Servico>();
    public DbSet<FormaPagamento> FormasPagamento => Set<FormaPagamento>();
    public DbSet<Venda> Vendas => Set<Venda>();
    public DbSet<ItemVenda> ItensVenda => Set<ItemVenda>();
    public DbSet<CompraReposicao> ComprasReposicao => Set<CompraReposicao>();
    public DbSet<ItemReposicao> ItensReposicao => Set<ItemReposicao>();
    public DbSet<Estoque> Estoques => Set<Estoque>();
    public DbSet<ConfiguracaoEmpresa> ConfiguracoesEmpresa => Set<ConfiguracaoEmpresa>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(NeyBateriasDbContext).Assembly);
        base.OnModelCreating(modelBuilder);
    }
}
