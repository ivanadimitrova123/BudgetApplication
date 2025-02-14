using BudgetApplication_KINGICT.Services.Interfaces;
using BudgetApplication.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace BudgetApplication.Controllers;

[Authorize] 
[Route("api/[controller]")]
[ApiController]
public class ExpenseController : ControllerBase
{
    private readonly IExpenseService _expenseService;

    public ExpenseController(IExpenseService expenseService)
    {
        _expenseService = expenseService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllExpenses()
    {
        int userId = GetUserIdFromToken();
        var expenses = await _expenseService.GetAllExpensesByUserIdAsync(userId);
        return Ok(expenses);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetExpense(int id)
    {
        int userId = GetUserIdFromToken();
        var expense = await _expenseService.GetExpenseByIdAsync(id, userId);
        if (expense == null)
        {
            return NotFound("Expense not found.");
        }

        return Ok(expense);
    }

    [HttpPost]
    public async Task<IActionResult> AddExpense([FromBody] Expense expense)
    {
        if (expense == null)
        {
            return BadRequest("Invalid expense data.");
        }

        expense.UserId = GetUserIdFromToken();

        var result = await _expenseService.AddExpenseAsync(expense);
        if (!result)
        {
            return BadRequest("Failed to add expense.");
        }

        return Ok("Expense added successfully.");
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateExpense(int id, [FromBody] Expense expense)
    {
        if (expense == null || id != expense.Id)
        {
            return BadRequest("Invalid data.");
        }

        expense.UserId = GetUserIdFromToken(); 

        var result = await _expenseService.UpdateExpenseAsync(expense);
        if (!result)
        {
            return NotFound("Expense not found or could not be updated.");
        }

        return Ok("Expense updated successfully.");
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteExpense(int id)
    {
        int userId = GetUserIdFromToken();

        var result = await _expenseService.DeleteExpenseAsync(id, userId);
        if (!result)
        {
            return NotFound("Expense not found.");
        }

        return Ok("Expense deleted successfully.");
    }

    private int GetUserIdFromToken()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        return userIdClaim != null ? int.Parse(userIdClaim.Value) : 0;
    }
}