using BudgetApplication_KINGICT.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using BudgetApplication_KINGICT.Data.Models;

namespace BudgetApplication_KINGICT.Controllers;

[Authorize] 
[Route("api/[controller]")]
[ApiController]
public class IncomeController : ControllerBase
{
    private readonly IIncomeService _incomeService;

    public IncomeController(IIncomeService incomeService)
    {
        _incomeService = incomeService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllIncomes()
    {
        int userId = GetUserIdFromToken();
        var incomes = await _incomeService.GetAllIncomesByUserIdAsync(userId);
        return Ok(incomes);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetIncome(int id)
    {
        int userId = GetUserIdFromToken();
        var income = await _incomeService.GetIncomeByIdAsync(id, userId);
        if (income == null)
        {
            return NotFound(new { message = "Income not found."});
        }

        return Ok(income);
    }

    [HttpPost]
    public async Task<IActionResult> AddIncome([FromBody] Income income)
    {
        if (income == null)
        {
            return BadRequest(new { message = "Invalid income data."});
        }

        income.UserId = GetUserIdFromToken();

        var result = await _incomeService.AddIncomeAsync(income);
        if (!result)
        {
            return BadRequest(new { message = "Failed to add income."});
        }

        return Ok(new { message = "Income added successfully."});
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateIncome(int id, [FromBody] Income income)
    {
        if (income == null || id != income.Id)
        {
            return BadRequest(new { message = "Invalid data."});
        }

        income.UserId = GetUserIdFromToken();

        var result = await _incomeService.UpdateIncomeAsync(income);
        if (!result)
        {
            return NotFound(new { message = "Income not found or could not be updated."});
        }

        return Ok(new { message = "Income updated successfully."});
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteIncome(int id)
    {
        int userId = GetUserIdFromToken();

        var result = await _incomeService.DeleteIncomeAsync(id, userId);
        if (!result)
        {
            return NotFound(new { message = "Income not found."});
        }

        return Ok(new { message = "Income deleted successfully."});
    }

    private int GetUserIdFromToken()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        return userIdClaim != null ? int.Parse(userIdClaim.Value) : 0;
    }
}

