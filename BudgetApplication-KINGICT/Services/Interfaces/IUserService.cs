using BudgetApplication.Data.Dtos;
using BudgetApplication.Models;

namespace BudgetApplication_KINGICT.Services.Interfaces;

public interface IUserService
{
    //Task<(string Token, UserDto User)> LoginUserAsync(LogInUserDto model);
    //Task<User> GetCurrentUserInfoAsync(long userId);
    //Task<object> GetUserProfileAsync(long userId);
    Task RegisterUserAsync(User user);
    Task<bool> DeleteUserAsync(int id);
    Task<bool> EditUserAsync(int id, User user);
    Task<string?> LoginAsync(LoginDto loginDto);


}