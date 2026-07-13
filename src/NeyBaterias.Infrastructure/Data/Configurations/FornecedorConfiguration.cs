using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NeyBaterias.Domain.Entities;

namespace NeyBaterias.Infrastructure.Data.Configurations;

public class FornecedorConfiguration : IEntityTypeConfiguration<Fornecedor>
{
    public void Configure(EntityTypeBuilder<Fornecedor> builder)
    {
        builder.ToTable("fornecedor");
        builder.HasKey(f => f.IdFornecedor);

        builder.Property(f => f.RazaoSocial).HasMaxLength(200).IsRequired();
        builder.Property(f => f.Cnpj).HasMaxLength(18).IsRequired();
        builder.Property(f => f.Telefone).HasMaxLength(20);
        builder.Property(f => f.Email).HasMaxLength(150);
        builder.Property(f => f.Endereco).HasMaxLength(200);
        builder.Property(f => f.Contato).HasMaxLength(150);

        builder.HasIndex(f => f.Cnpj).IsUnique();
    }
}
