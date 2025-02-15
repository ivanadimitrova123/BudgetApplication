using BudgetApplication_KINGICT.Data;
using BudgetApplication_KINGICT.Data.Models;
using BudgetApplication_KINGICT.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BudgetApplication_KINGICT.Repositories.Implementation;

public class ExpenseRepository : IExpenseRepository
{
    private readonly ApplicationDbContext _context;

    public ExpenseRepository(ApplicationDbContext context)
    {
        _context = context;
    }
    public async Task<IEnumerable<Expense>> GetAllExpensesByUserIdAsync(int userId)
    {
        return await _context.Expenses
            .Where(e => e.UserId == userId)
            .Include(e => e.Category) 
            .ToListAsync();
    }

    public async Task<Expense?> GetExpenseByIdAsync(int id, int userId)
    {
        return await _context.Expenses
            .Where(e => e.Id == id && e.UserId == userId)
            .Include(e => e.Category) 
            .FirstOrDefaultAsync();    }

    public async Task AddExpenseAsync(Expense expense)
    {
        _context.Expenses.Add(expense);
        await SaveChangesAsync();
    }

    public async Task UpdateExpenseAsync(Expense expense)
    {
        _context.Expenses.Update(expense);
    }

    public async Task DeleteExpenseAsync(int id)
    {
        var expense = await _context.Expenses.FindAsync(id);
        if (expense != null)
        {
            _context.Expenses.Remove(expense);
        }
    }
    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}