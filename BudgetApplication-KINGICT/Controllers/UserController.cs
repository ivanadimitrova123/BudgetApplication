using BudgetApplication_KINGICT.Services.Interfaces;
using BudgetApplication.Data.Dtos;
using BudgetApplication.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BudgetApplication.Controllers;

[ApiController]
[Route("api/users")]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;

    public UsersController(IUserService userService)
    {
        _userService = userService;
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
            return Ok("Registration successful.");
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
            return Unauthorized("Invalid username or password");
        }

        return Ok(token);
    }
    
    [HttpPut("{id}")]
    public async Task<IActionResult> EditUser(int id, [FromBody] User user)
    {
        var result = await _userService.EditUserAsync(id, user);
        if (!result)
        {
            return NotFound("User not found");
        }

        return Ok("User updated successfully");
    }
    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        var result = await _userService.DeleteUserAsync(id);
        if (!result)
        {
            return NotFound("User not found" );
        }

        return Ok("User deleted successfully");
    }

}
