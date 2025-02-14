using BudgetApplication.Models;

namespace BudgetApplication_KINGICT.Repositories.Interfaces;

public interface IIncomeRepository
{
    Task<IEnumerable<Income>> GetAllIncomesAsync(int userId);
    Task<Income?> GetIncomeByIdAsync(int id, int userId);
    Task AddIncomeAsync(Income income);
    Task UpdateIncomeAsync(Income income);
    Task DeleteIncomeAsync(Income income);
    Task SaveChangesAsync();
}
