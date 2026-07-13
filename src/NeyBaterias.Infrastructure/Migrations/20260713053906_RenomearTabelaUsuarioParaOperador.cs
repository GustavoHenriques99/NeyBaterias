using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NeyBaterias.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RenomearTabelaUsuarioParaOperador : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_venda_usuario_id_operador",
                table: "venda");

            migrationBuilder.DropPrimaryKey(
                name: "pk_usuario",
                table: "usuario");

            migrationBuilder.RenameTable(
                name: "usuario",
                newName: "Operador");

            migrationBuilder.RenameIndex(
                name: "ix_usuario_login",
                table: "Operador",
                newName: "ix_operador_login");

            migrationBuilder.RenameIndex(
                name: "ix_usuario_email",
                table: "Operador",
                newName: "ix_operador_email");

            migrationBuilder.AddPrimaryKey(
                name: "pk_operador",
                table: "Operador",
                column: "id_operador");

            migrationBuilder.AddForeignKey(
                name: "fk_venda_operador_id_operador",
                table: "venda",
                column: "id_operador",
                principalTable: "Operador",
                principalColumn: "id_operador",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_venda_operador_id_operador",
                table: "venda");

            migrationBuilder.DropPrimaryKey(
                name: "pk_operador",
                table: "Operador");

            migrationBuilder.RenameTable(
                name: "Operador",
                newName: "usuario");

            migrationBuilder.RenameIndex(
                name: "ix_operador_login",
                table: "usuario",
                newName: "ix_usuario_login");

            migrationBuilder.RenameIndex(
                name: "ix_operador_email",
                table: "usuario",
                newName: "ix_usuario_email");

            migrationBuilder.AddPrimaryKey(
                name: "pk_usuario",
                table: "usuario",
                column: "id_operador");

            migrationBuilder.AddForeignKey(
                name: "fk_venda_usuario_id_operador",
                table: "venda",
                column: "id_operador",
                principalTable: "usuario",
                principalColumn: "id_operador",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
