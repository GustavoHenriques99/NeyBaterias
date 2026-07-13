using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NeyBaterias.Domain.Entities;

namespace NeyBaterias.Infrastructure.Data.Configurations;

public class CompraReposicaoConfiguration : IEntityTypeConfiguration<CompraReposicao>
{
    public void Configure(EntityTypeBuilder<CompraReposicao> builder)
    {
        builder.ToTable("compra_reposicao");
        builder.HasKey(c => c.IdReposicao);

        builder.Property(c => c.Preco).HasColumnType("numeric(12,2)");

        builder.HasOne(c => c.Fornecedor)
            .WithMany(f => f.ComprasReposicao)
            .HasForeignKey(c => c.IdFornecedor)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

public class ItemReposicaoConfiguration : IEntityTypeConfiguration<ItemReposicao>
{
    public void Configure(EntityTypeBuilder<ItemReposicao> builder)
    {
        builder.ToTable("item_reposicao");
        builder.HasKey(i => i.IdItemReposicao);

        builder.Property(i => i.PrecoCompra).HasColumnType("numeric(12,2)");

        builder.HasOne(i => i.CompraReposicao)
            .WithMany(c => c.ItensReposicao)
            .HasForeignKey(i => i.IdReposicao)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(i => i.Produto)
            .WithMany(p => p.ItensReposicao)
            .HasForeignKey(i => i.IdProduto)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
