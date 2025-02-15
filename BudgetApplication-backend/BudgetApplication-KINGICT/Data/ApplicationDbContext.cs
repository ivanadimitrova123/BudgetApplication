using BudgetApplication_KINGICT.Data.Models;
using Microsoft.EntityFrameworkCore;

namespace BudgetApplication_KINGICT.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

    public DbSet<User> Users { get; set; }
    public DbSet<City> Cities { get; set; }
    public DbSet<Position> Positions { get; set; }
    public DbSet<Category> Categories { get; set; }
    public DbSet<Expense> Expenses { get; set; }
    
    public DbSet<Income> Incomes { get; set; }

    
}