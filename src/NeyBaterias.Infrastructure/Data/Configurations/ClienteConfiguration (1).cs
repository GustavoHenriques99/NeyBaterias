using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NeyBaterias.Domain.Entities;

namespace NeyBaterias.Infrastructure.Data.Configurations;

public class ClienteConfiguration : IEntityTypeConfiguration<Cliente>
{
    public void Configure(EntityTypeBuilder<Cliente> builder)
    {
        builder.ToTable("cliente");
        builder.HasKey(c => c.IdCliente);

        // 1:1 opcional — um cliente é OU físico OU jurídico
        builder.HasOne(c => c.ClienteFisico)
            .WithOne(cf => cf.Cliente)
            .HasForeignKey<ClienteFisico>(cf => cf.IdCliente)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(c => c.ClienteJuridico)
            .WithOne(cj => cj.Cliente)
            .HasForeignKey<ClienteJuridico>(cj => cj.IdCliente)
            .OnDelete(DeleteBehavior.Cascade);
    }
}

public class ClienteFisicoConfiguration : IEntityTypeConfiguration<ClienteFisico>
{
    public void Configure(EntityTypeBuilder<ClienteFisico> builder)
    {
        builder.ToTable("cliente_fisico");
        builder.HasKey(cf => cf.IdClienteFisico);

        builder.Property(cf => cf.Cpf).HasMaxLength(14).IsRequired();
        builder.Property(cf => cf.Nome).HasMaxLength(150).IsRequired();
        builder.Property(cf => cf.Email).HasMaxLength(150);
        builder.Property(cf => cf.Telefone).HasMaxLength(20);
        builder.Property(cf => cf.Cep).HasMaxLength(9);
        builder.Property(cf => cf.Endereco).HasMaxLength(200);
        builder.Property(cf => cf.Cidade).HasMaxLength(100);

        builder.HasIndex(cf => cf.Cpf).IsUnique();
        builder.HasIndex(cf => cf.IdCliente).IsUnique();
    }
}

public class ClienteJuridicoConfiguration : IEntityTypeConfiguration<ClienteJuridico>
{
    public void Configure(EntityTypeBuilder<ClienteJuridico> builder)
    {
        builder.ToTable("cliente_juridico");
        builder.HasKey(cj => cj.IdClienteJuridico);

        builder.Property(cj => cj.Cnpj).HasMaxLength(18).IsRequired();
        builder.Property(cj => cj.RazaoSocial).HasMaxLength(200).IsRequired();
        builder.Property(cj => cj.NomeFantasia).HasMaxLength(200);
        builder.Property(cj => cj.Ie).HasMaxLength(20);
        builder.Property(cj => cj.ImTelefone).HasMaxLength(20);
        builder.Property(cj => cj.TelCelular).HasMaxLength(20);

        builder.HasIndex(cj => cj.Cnpj).IsUnique();
        builder.HasIndex(cj => cj.IdCliente).IsUnique();
    }
}
