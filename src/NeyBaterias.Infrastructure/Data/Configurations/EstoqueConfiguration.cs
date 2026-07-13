using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NeyBaterias.Domain.Entities;
using NeyBaterias.Domain.Enums;

namespace NeyBaterias.Infrastructure.Data.Configurations;

public class EstoqueConfiguration : IEntityTypeConfiguration<Estoque>
{
    public void Configure(EntityTypeBuilder<Estoque> builder)
    {
        builder.ToTable("estoque");
        builder.HasKey(e => e.IdEstoque);

        builder.Property(e => e.TipoMovimento)
            .HasConversion(
                v => v == TipoMovimentoEstoque.Entrada ? "Entrada" : "Saida",
                v => v == "Entrada" ? TipoMovimentoEstoque.Entrada : TipoMovimentoEstoque.Saida)
            .HasMaxLength(10)
            .IsRequired();

        builder.HasOne(e => e.Produto)
            .WithMany(p => p.MovimentosEstoque)
            .HasForeignKey(e => e.IdProduto)
            .OnDelete(DeleteBehavior.Restrict);

        // 1:1 opcional — o movimento se origina OU de uma venda OU de uma reposição
        builder.HasOne(e => e.ItemVenda)
            .WithOne(iv => iv.MovimentoEstoque)
            .HasForeignKey<Estoque>(e => e.IdItemVenda)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(e => e.ItemReposicao)
            .WithOne(ir => ir.MovimentoEstoque)
            .HasForeignKey<Estoque>(e => e.IdItemReposicao)
            .OnDelete(DeleteBehavior.Restrict);

        // Garante que o movimento tenha origem em exatamente uma das duas operações
        builder.ToTable(t => t.HasCheckConstraint(
            "CK_Estoque_OrigemUnica",
            "(id_item_venda IS NOT NULL AND id_item_reposicao IS NULL) OR (id_item_venda IS NULL AND id_item_reposicao IS NOT NULL)"));
    }
}
