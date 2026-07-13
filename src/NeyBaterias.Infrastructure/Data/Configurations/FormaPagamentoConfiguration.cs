using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NeyBaterias.Domain.Entities;

namespace NeyBaterias.Infrastructure.Data.Configurations;

public class FormaPagamentoConfiguration : IEntityTypeConfiguration<FormaPagamento>
{
    public void Configure(EntityTypeBuilder<FormaPagamento> builder)
    {
        builder.ToTable("forma_pagamento");
        builder.HasKey(f => f.IdPagamento);

        builder.Property(f => f.Descricao).HasMaxLength(100).IsRequired();
    }
}
