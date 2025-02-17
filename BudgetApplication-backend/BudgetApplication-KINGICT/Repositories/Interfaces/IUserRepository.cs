using BudgetApplication_KINGICT.Data.Models;

namespace BudgetApplication_KINGICT.Repositories.Interfaces;

public interface IUserRepository
{
    Task<User> GetUserByUsernameAsync(string username);
    Task<User> GetUserByEmailAsync(string email);
    Task<User> GetUserByIdAsync(long userId);
    Task DeleteUserAsync(User user);
    Task UpdateUserAsync(User user);
    Task AddUserAsync(User user);
    Task SaveChangesAsync();

    Task<List<string>> GetAllUsernamesAsync();

}