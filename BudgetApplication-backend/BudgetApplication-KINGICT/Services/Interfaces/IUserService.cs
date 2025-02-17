using BudgetApplication_KINGICT.Data.Dtos;
using BudgetApplication_KINGICT.Data.Models;

namespace BudgetApplication_KINGICT.Services.Interfaces;

public interface IUserService
{
    Task<User> GetUserByIdAsync(long userId); 
    Task<User> GetUserByUsernameAsync(string username);  
    Task RegisterUserAsync(User user);
    Task<bool> DeleteUserAsync(int id);
    Task<bool> EditUserAsync(int id, User user);
    Task<string?> LoginAsync(LoginDto loginDto);

    Task<bool> DeactivateUserAsync(int id);

    Task<List<string>> GetAllUsernamesAsync();

}