using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NeyBaterias.Domain.Entities;

namespace NeyBaterias.Infrastructure.Data.Configurations;

public class VendaConfiguration : IEntityTypeConfiguration<Venda>
{
    public void Configure(EntityTypeBuilder<Venda> builder)
    {
        builder.ToTable("venda");
        builder.HasKey(v => v.IdVenda);

        builder.Property(v => v.PrecoVenda).HasColumnType("numeric(12,2)");
        builder.Property(v => v.Desconto).HasColumnType("numeric(12,2)");
        builder.Property(v => v.PrecoTotal).HasColumnType("numeric(12,2)");

        builder.HasOne(v => v.Cliente)
            .WithMany(c => c.Vendas)
            .HasForeignKey(v => v.IdCliente)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(v => v.Operador)
            .WithMany(u => u.Vendas)
            .HasForeignKey(v => v.IdOperador)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(v => v.FormaPagamento)
            .WithMany(f => f.Vendas)
            .HasForeignKey(v => v.IdPagamento)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

public class ItemVendaConfiguration : IEntityTypeConfiguration<ItemVenda>
{
    public void Configure(EntityTypeBuilder<ItemVenda> builder)
    {
        builder.ToTable("item_venda");
        builder.HasKey(iv => iv.IdItemVenda);

        builder.Property(iv => iv.PrecoVenda).HasColumnType("numeric(12,2)");

        builder.HasOne(iv => iv.Venda)
            .WithMany(v => v.ItensVenda)
            .HasForeignKey(iv => iv.IdVenda)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(iv => iv.Item)
            .WithMany(i => i.ItensVenda)
            .HasForeignKey(iv => iv.IdItem)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
