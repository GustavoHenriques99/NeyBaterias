using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NeyBaterias.Domain.Entities;

namespace NeyBaterias.Infrastructure.Data.Configurations;

public class OperadorConfiguration : IEntityTypeConfiguration<Operador>
{
    public void Configure(EntityTypeBuilder<Operador> builder)
    {
        builder.ToTable("operador");
        builder.HasKey(o => o.IdOperador);
        builder.Property(o => o.Nome).IsRequired().HasMaxLength(100);
        builder.Property(o => o.Sobrenome).IsRequired().HasMaxLength(100);
    }
}