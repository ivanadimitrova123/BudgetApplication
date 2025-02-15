using BudgetApplication_KINGICT.Data.Models;

namespace BudgetApplication_KINGICT.Repositories.Interfaces;

public interface IExpenseRepository
{
    Task<IEnumerable<Expense>> GetAllExpensesByUserIdAsync(int userId);
    Task<Expense?> GetExpenseByIdAsync(int id, int userId);
    Task AddExpenseAsync(Expense expense);
    Task UpdateExpenseAsync(Expense expense);
    Task DeleteExpenseAsync(int id);
    Task SaveChangesAsync();

}