using BudgetApplication_KINGICT.Data.Models;

namespace BudgetApplication_KINGICT.Repositories.Interfaces;

public interface ICityRepository
{
    Task<List<City>> GetAllCitiesAsync();
    Task<City> AddCityAsync(City city);
    Task<List<City>> SearchCitiesAsync(string name); 
}