using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace NeyBaterias.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "cliente",
                columns: table => new
                {
                    id_cliente = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    data_cadastro = table.Column<DateOnly>(type: "date", nullable: false),
                    ativo = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_cliente", x => x.id_cliente);
                });

            migrationBuilder.CreateTable(
                name: "forma_pagamento",
                columns: table => new
                {
                    id_pagamento = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    descricao = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_forma_pagamento", x => x.id_pagamento);
                });

            migrationBuilder.CreateTable(
                name: "fornecedor",
                columns: table => new
                {
                    id_fornecedor = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    razao_social = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    cnpj = table.Column<string>(type: "character varying(18)", maxLength: 18, nullable: false),
                    telefone = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    email = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    endereco = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    contato = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_fornecedor", x => x.id_fornecedor);
                });

            migrationBuilder.CreateTable(
                name: "item",
                columns: table => new
                {
                    id_item = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    descricao = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    valor = table.Column<decimal>(type: "numeric(12,2)", nullable: false),
                    tipo = table.Column<string>(type: "character varying(1)", maxLength: 1, nullable: false),
                    ativo = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_item", x => x.id_item);
                });

            migrationBuilder.CreateTable(
                name: "usuario",
                columns: table => new
                {
                    id_operador = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    nome = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    sobrenome = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    data_nascimento = table.Column<DateOnly>(type: "date", nullable: false),
                    sexo = table.Column<string>(type: "text", nullable: false),
                    email = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    tel_celular = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    login = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    senha = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    data_admissao = table.Column<DateOnly>(type: "date", nullable: false),
                    cargo = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    nivel_acesso = table.Column<int>(type: "integer", nullable: false),
                    ativo = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_usuario", x => x.id_operador);
                });

            migrationBuilder.CreateTable(
                name: "cliente_fisico",
                columns: table => new
                {
                    id_cliente_fisico = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    cpf = table.Column<string>(type: "character varying(14)", maxLength: 14, nullable: false),
                    nome = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    email = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    data_nascimento = table.Column<DateOnly>(type: "date", nullable: false),
                    telefone = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    cep = table.Column<string>(type: "character varying(9)", maxLength: 9, nullable: false),
                    endereco = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    numero = table.Column<string>(type: "text", nullable: false),
                    complemento = table.Column<string>(type: "text", nullable: true),
                    cidade = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    id_cliente = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_cliente_fisico", x => x.id_cliente_fisico);
                    table.ForeignKey(
                        name: "fk_cliente_fisico_cliente_id_cliente",
                        column: x => x.id_cliente,
                        principalTable: "cliente",
                        principalColumn: "id_cliente",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "cliente_juridico",
                columns: table => new
                {
                    id_cliente_juridico = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    cnpj = table.Column<string>(type: "character varying(18)", maxLength: 18, nullable: false),
                    razao_social = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    nome_fantasia = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    ie = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    im_telefone = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    tel_celular = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    id_cliente = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_cliente_juridico", x => x.id_cliente_juridico);
                    table.ForeignKey(
                        name: "fk_cliente_juridico_cliente_id_cliente",
                        column: x => x.id_cliente,
                        principalTable: "cliente",
                        principalColumn: "id_cliente",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "compra_reposicao",
                columns: table => new
                {
                    id_reposicao = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    data_reposicao = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    preco = table.Column<decimal>(type: "numeric(12,2)", nullable: false),
                    id_fornecedor = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_compra_reposicao", x => x.id_reposicao);
                    table.ForeignKey(
                        name: "fk_compra_reposicao_fornecedor_id_fornecedor",
                        column: x => x.id_fornecedor,
                        principalTable: "fornecedor",
                        principalColumn: "id_fornecedor",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "produto",
                columns: table => new
                {
                    id_produto = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    descricao = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    amperagem = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    marca = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    modelo = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    preco_custo = table.Column<decimal>(type: "numeric(12,2)", nullable: false),
                    preco_venda = table.Column<decimal>(type: "numeric(12,2)", nullable: false),
                    id_item = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_produto", x => x.id_produto);
                    table.ForeignKey(
                        name: "fk_produto_item_id_item",
                        column: x => x.id_item,
                        principalTable: "item",
                        principalColumn: "id_item",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "servico",
                columns: table => new
                {
                    id_servico = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    descricao = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    preco = table.Column<decimal>(type: "numeric(12,2)", nullable: false),
                    tempo_estimado = table.Column<int>(type: "integer", nullable: false),
                    id_item = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_servico", x => x.id_servico);
                    table.ForeignKey(
                        name: "fk_servico_item_id_item",
                        column: x => x.id_item,
                        principalTable: "item",
                        principalColumn: "id_item",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "venda",
                columns: table => new
                {
                    id_venda = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    data_venda = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    preco_venda = table.Column<decimal>(type: "numeric(12,2)", nullable: false),
                    desconto = table.Column<decimal>(type: "numeric(12,2)", nullable: false),
                    preco_total = table.Column<decimal>(type: "numeric(12,2)", nullable: false),
                    id_cliente = table.Column<int>(type: "integer", nullable: false),
                    id_operador = table.Column<int>(type: "integer", nullable: false),
                    id_pagamento = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_venda", x => x.id_venda);
                    table.ForeignKey(
                        name: "fk_venda_cliente_id_cliente",
                        column: x => x.id_cliente,
                        principalTable: "cliente",
                        principalColumn: "id_cliente",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_venda_forma_pagamento_id_pagamento",
                        column: x => x.id_pagamento,
                        principalTable: "forma_pagamento",
                        principalColumn: "id_pagamento",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_venda_usuario_id_operador",
                        column: x => x.id_operador,
                        principalTable: "usuario",
                        principalColumn: "id_operador",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "item_reposicao",
                columns: table => new
                {
                    id_item_reposicao = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    qtd = table.Column<int>(type: "integer", nullable: false),
                    preco_compra = table.Column<decimal>(type: "numeric(12,2)", nullable: false),
                    id_reposicao = table.Column<int>(type: "integer", nullable: false),
                    id_produto = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_item_reposicao", x => x.id_item_reposicao);
                    table.ForeignKey(
                        name: "fk_item_reposicao_compra_reposicao_id_reposicao",
                        column: x => x.id_reposicao,
                        principalTable: "compra_reposicao",
                        principalColumn: "id_reposicao",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_item_reposicao_produto_id_produto",
                        column: x => x.id_produto,
                        principalTable: "produto",
                        principalColumn: "id_produto",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "item_venda",
                columns: table => new
                {
                    id_item_venda = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    qtd = table.Column<int>(type: "integer", nullable: false),
                    preco_venda = table.Column<decimal>(type: "numeric(12,2)", nullable: false),
                    id_venda = table.Column<int>(type: "integer", nullable: false),
                    id_item = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_item_venda", x => x.id_item_venda);
                    table.ForeignKey(
                        name: "fk_item_venda_item_id_item",
                        column: x => x.id_item,
                        principalTable: "item",
                        principalColumn: "id_item",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_item_venda_venda_id_venda",
                        column: x => x.id_venda,
                        principalTable: "venda",
                        principalColumn: "id_venda",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "estoque",
                columns: table => new
                {
                    id_estoque = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    qtd_movimento = table.Column<int>(type: "integer", nullable: false),
                    tipo_movimento = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false),
                    id_produto = table.Column<int>(type: "integer", nullable: false),
                    id_item_venda = table.Column<int>(type: "integer", nullable: true),
                    id_item_reposicao = table.Column<int>(type: "integer", nullable: true),
                    data_movimento = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_estoque", x => x.id_estoque);
                    table.CheckConstraint("CK_Estoque_OrigemUnica", "(id_item_venda IS NOT NULL AND id_item_reposicao IS NULL) OR (id_item_venda IS NULL AND id_item_reposicao IS NOT NULL)");
                    table.ForeignKey(
                        name: "fk_estoque_item_reposicao_id_item_reposicao",
                        column: x => x.id_item_reposicao,
                        principalTable: "item_reposicao",
                        principalColumn: "id_item_reposicao",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_estoque_item_venda_id_item_venda",
                        column: x => x.id_item_venda,
                        principalTable: "item_venda",
                        principalColumn: "id_item_venda",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_estoque_produto_id_produto",
                        column: x => x.id_produto,
                        principalTable: "produto",
                        principalColumn: "id_produto",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "ix_cliente_fisico_cpf",
                table: "cliente_fisico",
                column: "cpf",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_cliente_fisico_id_cliente",
                table: "cliente_fisico",
                column: "id_cliente",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_cliente_juridico_cnpj",
                table: "cliente_juridico",
                column: "cnpj",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_cliente_juridico_id_cliente",
                table: "cliente_juridico",
                column: "id_cliente",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_compra_reposicao_id_fornecedor",
                table: "compra_reposicao",
                column: "id_fornecedor");

            migrationBuilder.CreateIndex(
                name: "ix_estoque_id_item_reposicao",
                table: "estoque",
                column: "id_item_reposicao",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_estoque_id_item_venda",
                table: "estoque",
                column: "id_item_venda",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_estoque_id_produto",
                table: "estoque",
                column: "id_produto");

            migrationBuilder.CreateIndex(
                name: "ix_fornecedor_cnpj",
                table: "fornecedor",
                column: "cnpj",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_item_reposicao_id_produto",
                table: "item_reposicao",
                column: "id_produto");

            migrationBuilder.CreateIndex(
                name: "ix_item_reposicao_id_reposicao",
                table: "item_reposicao",
                column: "id_reposicao");

            migrationBuilder.CreateIndex(
                name: "ix_item_venda_id_item",
                table: "item_venda",
                column: "id_item");

            migrationBuilder.CreateIndex(
                name: "ix_item_venda_id_venda",
                table: "item_venda",
                column: "id_venda");

            migrationBuilder.CreateIndex(
                name: "ix_produto_id_item",
                table: "produto",
                column: "id_item",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_servico_id_item",
                table: "servico",
                column: "id_item",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_usuario_email",
                table: "usuario",
                column: "email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_usuario_login",
                table: "usuario",
                column: "login",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_venda_id_cliente",
                table: "venda",
                column: "id_cliente");

            migrationBuilder.CreateIndex(
                name: "ix_venda_id_operador",
                table: "venda",
                column: "id_operador");

            migrationBuilder.CreateIndex(
                name: "ix_venda_id_pagamento",
                table: "venda",
                column: "id_pagamento");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "cliente_fisico");

            migrationBuilder.DropTable(
                name: "cliente_juridico");

            migrationBuilder.DropTable(
                name: "estoque");

            migrationBuilder.DropTable(
                name: "servico");

            migrationBuilder.DropTable(
                name: "item_reposicao");

            migrationBuilder.DropTable(
                name: "item_venda");

            migrationBuilder.DropTable(
                name: "compra_reposicao");

            migrationBuilder.DropTable(
                name: "produto");

            migrationBuilder.DropTable(
                name: "venda");

            migrationBuilder.DropTable(
                name: "fornecedor");

            migrationBuilder.DropTable(
                name: "item");

            migrationBuilder.DropTable(
                name: "cliente");

            migrationBuilder.DropTable(
                name: "forma_pagamento");

            migrationBuilder.DropTable(
                name: "usuario");
        }
    }
}
