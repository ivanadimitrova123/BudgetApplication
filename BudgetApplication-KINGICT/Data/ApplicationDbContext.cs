using BudgetApplication.Models;
using Microsoft.EntityFrameworkCore;

namespace BudgetApplication.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

    public DbSet<User> Users { get; set; }
    public DbSet<City> Cities { get; set; }
    public DbSet<Position> Positions { get; set; }
    
}