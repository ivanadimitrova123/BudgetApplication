using BudgetApplication_KINGICT.Data.Models;

namespace BudgetApplication_KINGICT.Services.Interfaces;

public interface ICategoryService
{
    Task<IEnumerable<Category>> GetAllCategoriesAsync();
    Task<Category?> GetCategoryByIdAsync(int id);
    Task<IEnumerable<Category>> GetCategoriesByTypeAsync(string categoryFor); 
    Task<bool> AddCategoryAsync(string name, string type);
    Task<bool> UpdateCategoryAsync(int id, string name);
    Task<bool> DeleteCategoryAsync(int id);
}
