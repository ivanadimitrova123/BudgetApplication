using BudgetApplication_KINGICT.Data.Models;

namespace BudgetApplication_KINGICT.Services.Interfaces;

public interface ICityService
{
    Task<List<City>> GetAllCitiesAsync();
    Task<City> AddCityAsync(City city);
    Task<List<City>> SearchCitiesAsync(string name);


}