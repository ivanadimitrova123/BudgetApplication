using BudgetApplication.Models;

namespace BudgetApplication_KINGICT.Services.Interfaces;

public interface ICategoryService
{
    Task<IEnumerable<Category>> GetAllCategoriesAsync();
    Task<Category?> GetCategoryByIdAsync(int id);
    Task<bool> AddCategoryAsync(string name);
    Task<bool> UpdateCategoryAsync(int id, string name);
    Task<bool> DeleteCategoryAsync(int id);
}
