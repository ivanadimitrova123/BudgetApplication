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

    public UsersController(IUserService userService)
    {
        _userService = userService;
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
    
}
