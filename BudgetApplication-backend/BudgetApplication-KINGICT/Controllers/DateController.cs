using System.Security.Claims;
using BudgetApplication_KINGICT.Data;
using Microsoft.AspNetCore.Mvc;

namespace BudgetApplication_KINGICT.Controllers;
[ApiController]
[Route("api/[controller]")]
public class DateController: ControllerBase
{
    
    private readonly ApplicationDbContext _context;

    public DateController(ApplicationDbContext context)
    {
        _context = context;
    }
   
    [HttpGet("current-date")]
    public IActionResult GetCurrentDate()
    {
        var currentMonth = DateTime.Now.ToString("MMMM"); 
        var currentYear = DateTime.Now.Year; 

        return Ok(new { currentMonth, currentYear });
    }
    
    [HttpGet("months-with-data")]
    public IActionResult GetMonthsWithData()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null)
        {
            return Unauthorized("User not logged in.");
        }
        var userId = int.Parse(userIdClaim.Value);

        var monthsWithData = _context.Incomes
            .Where(i => i.UserId == userId)  
            .Select(i => new { i.Month, i.Year })
            .Union(_context.Expenses
                .Where(e => e.UserId == userId)  
                .Select(e => new { e.Month, e.Year }))
            .Distinct()
            .ToList();

        var sortedMonthsWithData = monthsWithData
            .OrderBy(x => x.Year)
            .ThenBy(x => DateTime.ParseExact(x.Month, "MMMM", null).Month)
            .ToList();

        return Ok(sortedMonthsWithData);
    }
}