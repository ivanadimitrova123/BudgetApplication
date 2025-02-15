using BudgetApplication_KINGICT.Data;
using BudgetApplication_KINGICT.Data.Models;
using BudgetApplication_KINGICT.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BudgetApplication_KINGICT.Repositories.Implementation;

public class IncomeRepository : IIncomeRepository
{
    private readonly ApplicationDbContext _context;

    public IncomeRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Income>> GetAllIncomesAsync(int userId)
    {
        return await _context.Incomes
            .Where(i => i.UserId == userId)
            .Include(i => i.Category)
            .ToListAsync();
    }

    public async Task<Income?> GetIncomeByIdAsync(int id, int userId)
    {
        return await _context.Incomes
            .Where(i => i.Id == id && i.UserId == userId)
            .Include(i => i.Category) 
            .FirstOrDefaultAsync();
    }

    public async Task AddIncomeAsync(Income income)
    {
        await _context.Incomes.AddAsync(income);
    }

    public async Task UpdateIncomeAsync(Income income)
    {
        _context.Incomes.Update(income);
    }

    public async Task DeleteIncomeAsync(Income income)
    {
        _context.Incomes.Remove(income);
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}
