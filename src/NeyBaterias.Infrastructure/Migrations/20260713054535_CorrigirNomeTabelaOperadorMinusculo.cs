using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NeyBaterias.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class CorrigirNomeTabelaOperadorMinusculo : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameTable(
                name: "Operador",
                newName: "operador");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameTable(
                name: "operador",
                newName: "Operador");
        }
    }
}
