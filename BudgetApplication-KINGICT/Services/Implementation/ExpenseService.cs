using BudgetApplication_KINGICT.Repositories.Interfaces;
using BudgetApplication_KINGICT.Services.Interfaces;
using BudgetApplication.Models;

namespace BudgetApplication_KINGICT.Services.Implementation;

using System.Collections.Generic;
using System.Threading.Tasks;

public class ExpenseService : IExpenseService
{
    private readonly IExpenseRepository _expenseRepository;

    public ExpenseService(IExpenseRepository expenseRepository)
    {
        _expenseRepository = expenseRepository;
    }

    public async Task<IEnumerable<Expense>> GetAllExpensesByUserIdAsync(int userId)
    {
        return await _expenseRepository.GetAllExpensesByUserIdAsync(userId);
    }

    public async Task<Expense?> GetExpenseByIdAsync(int id, int userId)
    {
        return await _expenseRepository.GetExpenseByIdAsync(id, userId);
    }

    public async Task<bool> AddExpenseAsync(Expense expense)
    {
        await _expenseRepository.AddExpenseAsync(expense);
        await _expenseRepository.SaveChangesAsync();
        return true;
    }

    public async Task<bool> UpdateExpenseAsync(Expense expense)
    {
        var existingExpense = await _expenseRepository.GetExpenseByIdAsync(expense.Id, expense.UserId);
        if (existingExpense == null)
        {
            return false;
        }

        existingExpense.Month = expense.Month;
        existingExpense.Year = expense.Year;
        existingExpense.Category = expense.Category;
        existingExpense.Amount = expense.Amount;
        existingExpense.Type = expense.Type;

        await _expenseRepository.UpdateExpenseAsync(existingExpense);
        await _expenseRepository.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteExpenseAsync(int id, int userId)
    {
        var expense = await _expenseRepository.GetExpenseByIdAsync(id, userId);
        if (expense == null)
        {
            return false;
        }

        await _expenseRepository.DeleteExpenseAsync(id);
        await _expenseRepository.SaveChangesAsync();
        return true;
    }
}

