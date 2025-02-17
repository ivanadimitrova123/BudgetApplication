using System.Globalization;
using BudgetApplication_KINGICT.Data.Dtos;
using BudgetApplication_KINGICT.Data.Models;
using BudgetApplication_KINGICT.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BudgetApplication_KINGICT.Controllers;

[ApiController]
[Route("api/users")]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly IEmailService _emailService;

    public UsersController(IUserService userService,IEmailService emailService)
    {
        _userService = userService;
        _emailService = emailService;
    }
    
    [HttpGet("{id}")]
    public async Task<IActionResult> GetUserById(long id)
    {
        var user = await _userService.GetUserByIdAsync(id);
        if (user == null)
        {
            return NotFound(new { message = "User not found" });
        }

        return Ok(user);
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(User model)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            await _userService.RegisterUserAsync(model);
            return Ok(new { message = "Registration successful." });
        }
        catch (Exception ex)
        {
            ModelState.AddModelError("Registration", ex.Message);
            return BadRequest(ModelState);
        }
    }
    
    [HttpGet("usernames")]
    public async Task<IActionResult> GetAllUsernames()
    {
        var usernames = await _userService.GetAllUsernamesAsync();
        return Ok(usernames);
    }
    
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
    {
        var token = await _userService.LoginAsync(loginDto);
        if (token == null)
        {
            return Unauthorized(new { message = "Invalid username or password"});
        }

        return Ok(new {token});
    }
    
    [HttpPut("{id}")]
    public async Task<IActionResult> EditUser(int id, [FromBody] User user)
    {
        var result = await _userService.EditUserAsync(id, user);
        if (!result)
        {
            return NotFound(new { message = "User not found"});
        }

        return Ok(new { message = "User updated successfully"});
    }
    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        var result = await _userService.DeleteUserAsync(id);
        if (!result)
        {
            return NotFound(new { message = "User not found"});
        }

        return Ok(new { message = "User deleted successfully"});
    }
    
    [Authorize]
    [HttpPut("deactivate/{id}")]
    public async Task<IActionResult> DeactivateUser(int id)
    {
        var result = await _userService.DeactivateUserAsync(id);
        if (!result)
        {
            return NotFound(new { message = "User not found" });
        }

        return Ok(new { message = "User profile deactivated successfully" });
    }
    
    [HttpPost("send-monthly-report/{username}/{month}")]
    public async Task<IActionResult> SendMonthlyReport(string username, string month)
    {
        var user = await _userService.GetUserByUsernameAsync(username);
        if (user == null)
        {
            return NotFound(new { message = "User not found" });
        }

        if (!DateTime.TryParseExact(month, "MMMM", CultureInfo.InvariantCulture, DateTimeStyles.None, out var parsedMonth))
        {
            return BadRequest(new { message = "Invalid month format" });
        }

        await _emailService.SendEmailAsync(user.Email, "MonthlyReport", new Dictionary<string, string>
        {
            { "UserName", user.Username },
            { "Month", parsedMonth.ToString("MMMM") }
        });

        return Ok(new { message = "Monthly report sent successfully" });
    }
}
