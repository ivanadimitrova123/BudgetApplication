using BudgetApplication.Models;

namespace BudgetApplication_KINGICT.Services.Interfaces;

public interface IExpenseService
{
    Task<IEnumerable<Expense>> GetAllExpensesByUserIdAsync(int userId);
    Task<Expense?> GetExpenseByIdAsync(int id, int userId);
    Task<bool> AddExpenseAsync(Expense expense);
    Task<bool> UpdateExpenseAsync(Expense expense);
    Task<bool> DeleteExpenseAsync(int id, int userId);
}