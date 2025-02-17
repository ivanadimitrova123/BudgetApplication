using BudgetApplication_KINGICT.Data;
using BudgetApplication_KINGICT.Data.Models;
using BudgetApplication_KINGICT.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BudgetApplication_KINGICT.Repositories.Implementation;

public class UserRepository : IUserRepository
{
    private readonly ApplicationDbContext _context;

    public UserRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<User>> GetAllUsersAsync()
    {
        return await _context.Users.ToListAsync();
    }

    public async Task<User> GetUserByIdAsync(long userId)
    {
        return await _context.Users
            .FirstOrDefaultAsync(u => u.Id == userId);
    }
    
    public async Task AddUserAsync(User user)
    {
        var cityExists = await _context.Cities.AnyAsync(c => c.Id == user.CityId);
        if (!cityExists)
        {
            throw new ArgumentException("City does not exist.");
        }
        
        var positionExists = await _context.Positions.AnyAsync(p => p.Id == user.PositionId);
        if (!positionExists)
        {
            throw new ArgumentException("   Position does not exist.");
        }
        _context.Users.Add(user);
        await SaveChangesAsync();
    }
    
    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }

    public async Task<User> GetUserByEmailAsync(string email)
    {
        return await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
    }

    public async Task<User> GetUserByUsernameAsync(string username)
    {
        return await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
    }
    
    public async Task DeleteUserAsync(User user)
    {
        _context.Users.Remove(user);
    }
    
    public async Task UpdateUserAsync(User user)
    {
        var cityExists = await _context.Cities.AnyAsync(c => c.Id == user.CityId);
        if (!cityExists)
        {
            throw new ArgumentException("City does not exist.");
        }
        
        var positionExists = await _context.Positions.AnyAsync(p => p.Id == user.PositionId);
        if (!positionExists)
        {
            throw new ArgumentException("Position does not exist.");
        }
        _context.Users.Update(user);
    }
    
    public async Task<List<string>> GetAllUsernamesAsync()
    {
        return await _context.Users.Select(u => u.Username).ToListAsync();
    }

}