using BudgetApplication_KINGICT.Data.Models;
using BudgetApplication_KINGICT.Repositories.Interfaces;
using BudgetApplication_KINGICT.Services.Interfaces;

namespace BudgetApplication_KINGICT.Services.Implementation;

public class CityService : ICityService
{
    private readonly ICityRepository _cityRepository;

    public CityService(ICityRepository cityRepository)
    {
        _cityRepository = cityRepository;
    }

    public async Task<List<City>> GetAllCitiesAsync()
    {
        return await _cityRepository.GetAllCitiesAsync();
    }

    public async Task<City> AddCityAsync(City city)
    {
        return await _cityRepository.AddCityAsync(city);
    }
    
    public async Task<List<City>> SearchCitiesAsync(string name)
    {
        return await _cityRepository.SearchCitiesAsync(name);
    }
}