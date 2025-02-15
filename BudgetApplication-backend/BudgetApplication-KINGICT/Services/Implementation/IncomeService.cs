using BudgetApplication_KINGICT.Data.Models;
using BudgetApplication_KINGICT.Repositories.Interfaces;
using BudgetApplication_KINGICT.Services.Interfaces;

namespace BudgetApplication_KINGICT.Services.Implementation;

public class IncomeService : IIncomeService
{
    private readonly IIncomeRepository _incomeRepository;

    public IncomeService(IIncomeRepository incomeRepository)
    {
        _incomeRepository = incomeRepository;
    }

    public async Task<IEnumerable<Income>> GetAllIncomesByUserIdAsync(int userId)
    {
        return await _incomeRepository.GetAllIncomesAsync(userId);
    }

    public async Task<Income?> GetIncomeByIdAsync(int id, int userId)
    {
        return await _incomeRepository.GetIncomeByIdAsync(id, userId);
    }

    public async Task<bool> AddIncomeAsync(Income income)
    {
        await _incomeRepository.AddIncomeAsync(income);
        await _incomeRepository.SaveChangesAsync();
        return true;
    }

    public async Task<bool> UpdateIncomeAsync(Income income)
    {
        var existingIncome = await _incomeRepository.GetIncomeByIdAsync(income.Id, income.UserId);
        if (existingIncome == null)
        {
            return false;
        }

        existingIncome.Month = income.Month;
        existingIncome.Year = income.Year;
        existingIncome.CategoryId = income.CategoryId;
        existingIncome.Amount = income.Amount;
        existingIncome.Type = income.Type;

        await _incomeRepository.UpdateIncomeAsync(existingIncome);
        await _incomeRepository.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteIncomeAsync(int id, int userId)
    {
        var income = await _incomeRepository.GetIncomeByIdAsync(id, userId);
        if (income == null) return false;

        await _incomeRepository.DeleteIncomeAsync(income);
        await _incomeRepository.SaveChangesAsync();
        return true;
    }
}
