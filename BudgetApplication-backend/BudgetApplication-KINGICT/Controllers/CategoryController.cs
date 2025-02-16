using BudgetApplication_KINGICT.Data.Models;
using BudgetApplication_KINGICT.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BudgetApplication_KINGICT.Controllers;

[Authorize] 
[Route("api/categories")]
[ApiController]
public class CategoryController : ControllerBase
{
    private readonly ICategoryService _categoryService;

    public CategoryController(ICategoryService categoryService)
    {
        _categoryService = categoryService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllCategories()
    {
        var categories = await _categoryService.GetAllCategoriesAsync();
        return Ok(categories);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetCategoryById(int id)
    {
        var category = await _categoryService.GetCategoryByIdAsync(id);
        if (category == null) return NotFound(new { message = "Category not found."});
        return Ok(category);
    }

    [HttpPost]
    public async Task<IActionResult> AddCategory([FromBody] Category category)
    {
        var added = await _categoryService.AddCategoryAsync(category.Name, category.CategoryFor);
        if (!added) return BadRequest(new { message = "Category already exists." });
        return Ok(new { message = "Category added successfully." });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateCategory(int id, [FromBody] string name)
    {
        var updated = await _categoryService.UpdateCategoryAsync(id, name);
        if (!updated) return NotFound(new { message = "Category not found."});
        return Ok(new { message = "Category updated successfully."});
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCategory(int id)
    {
        var deleted = await _categoryService.DeleteCategoryAsync(id);
        if (!deleted) return NotFound(new { message = "Category not found."});
        return Ok(new { message = "Category deleted successfully."});
    }
    
    [HttpGet("income")]
    public async Task<IActionResult> GetIncomeCategories()
    {
        var categories = await _categoryService.GetCategoriesByTypeAsync("Income");
        return Ok(categories);
    }

    [HttpGet("expense")]
    public async Task<IActionResult> GetExpenseCategories()
    {
        var categories = await _categoryService.GetCategoriesByTypeAsync("Expense");
        return Ok(categories);
    }
}
