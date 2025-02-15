using BudgetApplication_KINGICT.Data;
using BudgetApplication_KINGICT.Data.Models;
using BudgetApplication_KINGICT.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BudgetApplication_KINGICT.Repositories.Implementation;

public class CityRepository : ICityRepository
{
    private readonly ApplicationDbContext _context;

    public CityRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<City>> GetAllCitiesAsync()
    {
        return await _context.Cities.ToListAsync();     
    }

    public async Task<City> AddCityAsync(City city)
    {
        _context.Cities.Add(city);
        await _context.SaveChangesAsync();
        return city;
    }
    
    public async Task<List<City>> SearchCitiesAsync(string name)
    {
        return await _context.Cities
            .Where(c => EF.Functions.Like(c.Name, $"%{name}%"))
            .ToListAsync();
    }
}
