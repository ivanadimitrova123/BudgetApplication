using BudgetApplication_KINGICT.Data.Models;
using BudgetApplication_KINGICT.Repositories.Interfaces;
using BudgetApplication_KINGICT.Services.Interfaces;

namespace BudgetApplication_KINGICT.Services.Implementation;

public class CategoryService : ICategoryService
{
    private readonly ICategoryRepository _categoryRepository;

    public CategoryService(ICategoryRepository categoryRepository)
    {
        _categoryRepository = categoryRepository;
    }

    public async Task<IEnumerable<Category>> GetAllCategoriesAsync()
    {
        return await _categoryRepository.GetAllCategoriesAsync();
    }

    public async Task<Category?> GetCategoryByIdAsync(int id)
    {
        return await _categoryRepository.GetCategoryByIdAsync(id);
    }

    public async Task<bool> AddCategoryAsync(string name, string type)
    {
        if (await _categoryRepository.CategoryExistsAsync(name))
            return false;

        var category = new Category { Name = name ,CategoryFor = type};
        await _categoryRepository.AddCategoryAsync(category);
        await _categoryRepository.SaveChangesAsync();
        return true;
    }

    public async Task<bool> UpdateCategoryAsync(int id, string name)
    {
        var category = await _categoryRepository.GetCategoryByIdAsync(id);
        if (category == null) return false;

        category.Name = name;
        await _categoryRepository.UpdateCategoryAsync(category);
        await _categoryRepository.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteCategoryAsync(int id)
    {
        var category = await _categoryRepository.GetCategoryByIdAsync(id);
        if (category == null) return false;

        await _categoryRepository.DeleteCategoryAsync(category);
        await _categoryRepository.SaveChangesAsync();
        return true;
    }
    
    public async Task<IEnumerable<Category>> GetCategoriesByTypeAsync(string categoryFor)
    {
        return await _categoryRepository.GetCategoriesByTypeAsync(categoryFor);
    }
}
