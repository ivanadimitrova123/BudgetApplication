using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BudgetApplication_KINGICT.Repositories.Interfaces;
using BudgetApplication_KINGICT.Services.Interfaces;
using BudgetApplication.Data.Dtos;
using BudgetApplication.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;

namespace BudgetApplication_KINGICT.Services.Implementation;

public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;
    private readonly IPasswordHasher<User> _passwordHasher;
    
    public UserService(IUserRepository userRepository, IPasswordHasher<User> passwordHasher)
    {
        _userRepository = userRepository;
        _passwordHasher = passwordHasher;
    }
    
    public async Task RegisterUserAsync(User user)
    {
        var existingUserByEmail = await _userRepository.GetUserByEmailAsync(user.Email);
        if (existingUserByEmail != null)
        {
            throw new ArgumentException("A user with this email already exists.");
        }

        var existingUserByUsername = await _userRepository.GetUserByUsernameAsync(user.Username);
        if (existingUserByUsername != null)
        {
            throw new ArgumentException("A user with this username already exists.");
        }

        user.PasswordHash = _passwordHasher.HashPassword(user, user.PasswordHash);
        await _userRepository.AddUserAsync(user);
    }
    
    public async Task<string?> LoginAsync(LoginDto model)
    {
        var user = await _userRepository.GetUserByUsernameAsync(model.Username);
        if (user == null)
        {
            return null; 
        }

        var passwordVerificationResult = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, model.Password);
        if (passwordVerificationResult != PasswordVerificationResult.Success)
        {
            return null; 
        }

        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Username)
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("VkVSfGYr8VSkxDRF8ftKCwZuqN1lLLxBZN7s20jS"));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: "https://localhost:5030/",
            audience: "https://localhost:5030/",
            claims: claims,
            expires: DateTime.Now.AddDays(7),
            signingCredentials: creds
        );

        var tokenString = new JwtSecurityTokenHandler().WriteToken(token);
        
        return (tokenString);
    }
    
    public async Task<bool> EditUserAsync(int id, User changedUser)
    {
        var user = await _userRepository.GetUserByIdAsync(id);
        if (user == null)
        {
            return false; 
        }

        user.FirstName = changedUser.FirstName;
        user.LastName = changedUser.LastName;
        user.Username = changedUser.Username;
        user.Email = changedUser.Email;
        user.CityId = changedUser.CityId;
        user.PositionId = changedUser.PositionId;
        user.YearsInPosition = changedUser.YearsInPosition;
        user.YearsInExperience = changedUser.YearsInExperience;
        user.IsUserActive = changedUser.IsUserActive;

        await _userRepository.UpdateUserAsync(user);
        await _userRepository.SaveChangesAsync();
        return true;
    }
    
    
    public async Task<bool> DeleteUserAsync(int id)
    {
        var user = await _userRepository.GetUserByIdAsync(id);
        if (user == null)
        {
            return false; 
        }
        await _userRepository.DeleteUserAsync(user);
        await _userRepository.SaveChangesAsync();
        return true;
    }
}