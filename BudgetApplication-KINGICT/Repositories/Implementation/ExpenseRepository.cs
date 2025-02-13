using BudgetApplication_KINGICT.Repositories.Interfaces;
using BudgetApplication.Data;
using BudgetApplication.Models;
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
        return await _context.Expenses.Where(e => e.UserId == userId).ToListAsync();
    }

    public async Task<Expense?> GetExpenseByIdAsync(int id, int userId)
    {
        return await _context.Expenses.FirstOrDefaultAsync(e => e.Id == id && e.UserId == userId);
    }

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