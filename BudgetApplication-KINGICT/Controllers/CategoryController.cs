using BudgetApplication_KINGICT.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BudgetApplication.Controllers;

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
        if (category == null) return NotFound("Category not found.");
        return Ok(category);
    }

    [HttpPost]
    public async Task<IActionResult> AddCategory([FromBody] string name)
    {
        var added = await _categoryService.AddCategoryAsync(name);
        if (!added) return BadRequest("Category already exists.");
        return Ok("Category added successfully.");
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateCategory(int id, [FromBody] string name)
    {
        var updated = await _categoryService.UpdateCategoryAsync(id, name);
        if (!updated) return NotFound("Category not found.");
        return Ok("Category updated successfully.");
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCategory(int id)
    {
        var deleted = await _categoryService.DeleteCategoryAsync(id);
        if (!deleted) return NotFound("Category not found.");
        return Ok("Category deleted successfully.");
    }
}
