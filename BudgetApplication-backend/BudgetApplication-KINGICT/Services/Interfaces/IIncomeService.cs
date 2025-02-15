using BudgetApplication_KINGICT.Data.Models;

namespace BudgetApplication_KINGICT.Services.Interfaces;

public interface IIncomeService
{
    Task<IEnumerable<Income>> GetAllIncomesByUserIdAsync(int userId);
    Task<Income?> GetIncomeByIdAsync(int id, int userId);
    Task<bool> AddIncomeAsync(Income income);
    Task<bool> UpdateIncomeAsync(Income income);
    Task<bool> DeleteIncomeAsync(int id, int userId);
}
