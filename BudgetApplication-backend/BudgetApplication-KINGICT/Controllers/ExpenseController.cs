using BudgetApplication_KINGICT.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using BudgetApplication_KINGICT.Data.Models;

namespace BudgetApplication_KINGICT.Controllers;

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
            return NotFound(new { message = "Expense not found."});
        }

        return Ok(expense);
    }

    [HttpPost]
    public async Task<IActionResult> AddExpense([FromBody] Expense expense)
    {
        if (expense == null)
        {
            return BadRequest(new { message = "Invalid expense data."});
        }

        expense.UserId = GetUserIdFromToken();

        var result = await _expenseService.AddExpenseAsync(expense);
        if (!result)
        {
            return BadRequest(new { message = "Failed to add expense."});
        }

        return Ok(new { message = "Expense added successfully."});
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateExpense(int id, [FromBody] Expense expense)
    {
        if (expense == null || id != expense.Id)
        {
            return BadRequest(new { message = "Invalid data."});
        }

        expense.UserId = GetUserIdFromToken(); 

        var result = await _expenseService.UpdateExpenseAsync(expense);
        if (!result)
        {
            return NotFound(new { message = "Expense not found or could not be updated."});
        }

        return Ok(new { message = "Expense updated successfully."});
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteExpense(int id)
    {
        int userId = GetUserIdFromToken();

        var result = await _expenseService.DeleteExpenseAsync(id, userId);
        if (!result)
        {
            return NotFound(new { message = "Expense not found."});
        }

        return Ok(new { message = "Expense deleted successfully."});
    }

    private int GetUserIdFromToken()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        return userIdClaim != null ? int.Parse(userIdClaim.Value) : 0;
    }
}   