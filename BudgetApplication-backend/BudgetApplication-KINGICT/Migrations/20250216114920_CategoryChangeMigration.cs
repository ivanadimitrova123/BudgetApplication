using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BudgetApplication_KINGICT.Migrations
{
    /// <inheritdoc />
    public partial class CategoryChangeMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CategoryFor",
                table: "Categories",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CategoryFor",
                table: "Categories");
        }
    }
}
