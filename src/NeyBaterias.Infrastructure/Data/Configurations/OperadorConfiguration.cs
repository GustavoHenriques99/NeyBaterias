using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NeyBaterias.Domain.Entities;

namespace NeyBaterias.Infrastructure.Data.Configurations;

public class OperadorConfiguration : IEntityTypeConfiguration<Operador>
{
    public void Configure(EntityTypeBuilder<Operador> builder)
    {
        builder.ToTable("operador");
        builder.HasKey(u => u.IdOperador);

        builder.Property(u => u.Nome).HasMaxLength(100).IsRequired();
        builder.Property(u => u.Sobrenome).HasMaxLength(100).IsRequired();
        builder.Property(u => u.Email).HasMaxLength(150).IsRequired();
        builder.Property(u => u.TelCelular).HasMaxLength(20);
        builder.Property(u => u.Login).HasMaxLength(50).IsRequired();
        builder.Property(u => u.Senha).HasMaxLength(255).IsRequired();
        builder.Property(u => u.Cargo).HasMaxLength(100);

        builder.HasIndex(u => u.Login).IsUnique();
        builder.HasIndex(u => u.Email).IsUnique();
    }
}
