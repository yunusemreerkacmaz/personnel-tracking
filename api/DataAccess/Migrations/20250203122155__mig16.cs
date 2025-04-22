using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class _mig16 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<decimal>(
                name: "Longitude",
                table: "Stores",
                type: "decimal(25,15)",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(10,10)");

            migrationBuilder.AlterColumn<decimal>(
                name: "Laittude",
                table: "Stores",
                type: "decimal(25,15)",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(10,10)");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<decimal>(
                name: "Longitude",
                table: "Stores",
                type: "decimal(10,10)",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(25,15)");

            migrationBuilder.AlterColumn<decimal>(
                name: "Laittude",
                table: "Stores",
                type: "decimal(10,10)",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(25,15)");
        }
    }
}
