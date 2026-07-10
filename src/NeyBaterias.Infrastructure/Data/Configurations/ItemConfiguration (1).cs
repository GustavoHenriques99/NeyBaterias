using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NeyBaterias.Domain.Entities;
using NeyBaterias.Domain.Enums;

namespace NeyBaterias.Infrastructure.Data.Configurations;

public class ItemConfiguration : IEntityTypeConfiguration<Item>
{
    public void Configure(EntityTypeBuilder<Item> builder)
    {
        builder.ToTable("item");
        builder.HasKey(i => i.IdItem);

        builder.Property(i => i.Descricao).HasMaxLength(200).IsRequired();
        builder.Property(i => i.Valor).HasColumnType("numeric(12,2)");

        // Mapeia o enum para 'P' / 'S' como no DER original
        builder.Property(i => i.Tipo)
            .HasConversion(
                v => v == TipoItem.Produto ? "P" : "S",
                v => v == "P" ? TipoItem.Produto : TipoItem.Servico)
            .HasMaxLength(1)
            .IsRequired();

        builder.HasOne(i => i.Produto)
            .WithOne(p => p.Item)
            .HasForeignKey<Produto>(p => p.IdItem)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(i => i.Servico)
            .WithOne(s => s.Item)
            .HasForeignKey<Servico>(s => s.IdItem)
            .OnDelete(DeleteBehavior.Cascade);
    }
}

public class ProdutoConfiguration : IEntityTypeConfiguration<Produto>
{
    public void Configure(EntityTypeBuilder<Produto> builder)
    {
        builder.ToTable("produto");
        builder.HasKey(p => p.IdProduto);

        builder.Property(p => p.Descricao).HasMaxLength(200).IsRequired();
        builder.Property(p => p.Amperagem).HasMaxLength(20);
        builder.Property(p => p.Marca).HasMaxLength(100);
        builder.Property(p => p.Modelo).HasMaxLength(100);
        builder.Property(p => p.PrecoCusto).HasColumnType("numeric(12,2)");
        builder.Property(p => p.PrecoVenda).HasColumnType("numeric(12,2)");

        builder.HasIndex(p => p.IdItem).IsUnique();
    }
}

public class ServicoConfiguration : IEntityTypeConfiguration<Servico>
{
    public void Configure(EntityTypeBuilder<Servico> builder)
    {
        builder.ToTable("servico");
        builder.HasKey(s => s.IdServico);

        builder.Property(s => s.Descricao).HasMaxLength(200).IsRequired();
        builder.Property(s => s.Preco).HasColumnType("numeric(12,2)");

        builder.HasIndex(s => s.IdItem).IsUnique();
    }
}
