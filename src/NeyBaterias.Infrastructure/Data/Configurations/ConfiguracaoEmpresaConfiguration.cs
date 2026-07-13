using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NeyBaterias.Domain.Entities;

namespace NeyBaterias.Infrastructure.Data.Configurations;

public class ConfiguracaoEmpresaConfiguration : IEntityTypeConfiguration<ConfiguracaoEmpresa>
{
    public void Configure(EntityTypeBuilder<ConfiguracaoEmpresa> builder)
    {
        builder.ToTable("configuracao_empresa");
        builder.HasKey(c => c.Id);

        builder.Property(c => c.NomeEmpresa).HasMaxLength(200).IsRequired();
        builder.Property(c => c.Cnpj).HasMaxLength(18);
        builder.Property(c => c.Endereco).HasMaxLength(300);
        builder.Property(c => c.Telefone).HasMaxLength(20);
        builder.Property(c => c.Email).HasMaxLength(150);

        // Já deixa uma linha inicial (Id = 1) criada, pra tela de "Configurações"
        // nunca abrir vazia — sempre existe um registro pra editar.
        builder.HasData(new ConfiguracaoEmpresa
        {
            Id = 1,
            NomeEmpresa = "NeyBaterias",
            Cnpj = string.Empty,
            Endereco = string.Empty,
            Telefone = string.Empty,
            Email = string.Empty
        });
    }
}