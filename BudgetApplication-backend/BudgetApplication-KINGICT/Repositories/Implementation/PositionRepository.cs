using BudgetApplication_KINGICT.Data;
using BudgetApplication_KINGICT.Data.Models;
using BudgetApplication_KINGICT.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BudgetApplication_KINGICT.Repositories.Implementation;

public class PositionRepository : IPositionRepository
{
    private readonly ApplicationDbContext _context;

    public PositionRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<Position>> GetAllPositionsAsync()
    {
        return await _context.Positions.ToListAsync(); 
    }

    public async Task<Position> AddPositionAsync(Position position)
    {
        _context.Positions.Add(position);
        await _context.SaveChangesAsync();
        return position;
    }
    
    public async Task<List<Position>> SearchPositionsAsync(string name)
    {
        return await _context.Positions
            .Where(p => EF.Functions.Like(p.Name, $"%{name}%"))
            .ToListAsync();
    }
}