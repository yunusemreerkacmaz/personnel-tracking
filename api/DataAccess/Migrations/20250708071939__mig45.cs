using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class _mig45 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "AreaControl",
                table: "EntryExitRecords",
                newName: "IsInExitArea");

            migrationBuilder.AlterColumn<string>(
                name: "ExitActionType",
                table: "EntryExitRecords",
                type: "varchar(100)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "longtext",
                oldNullable: true)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AlterColumn<string>(
                name: "EntranceActionType",
                table: "EntryExitRecords",
                type: "varchar(100)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "longtext",
                oldNullable: true)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "EntryAddress",
                table: "EntryExitRecords",
                type: "varchar(300)",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "ExitAddress",
                table: "EntryExitRecords",
                type: "varchar(300)",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<bool>(
                name: "IsInEntryArea",
                table: "EntryExitRecords",
                type: "tinyint(1)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EntryAddress",
                table: "EntryExitRecords");

            migrationBuilder.DropColumn(
                name: "ExitAddress",
                table: "EntryExitRecords");

            migrationBuilder.DropColumn(
                name: "IsInEntryArea",
                table: "EntryExitRecords");

            migrationBuilder.RenameColumn(
                name: "IsInExitArea",
                table: "EntryExitRecords",
                newName: "AreaControl");

            migrationBuilder.AlterColumn<string>(
                name: "ExitActionType",
                table: "EntryExitRecords",
                type: "longtext",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(100)",
                oldNullable: true)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AlterColumn<string>(
                name: "EntranceActionType",
                table: "EntryExitRecords",
                type: "longtext",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(100)",
                oldNullable: true)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");
        }
    }
}
