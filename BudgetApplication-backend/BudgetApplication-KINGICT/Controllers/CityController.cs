using BudgetApplication_KINGICT.Data.Models;
using BudgetApplication_KINGICT.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace BudgetApplication_KINGICT.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CityController : ControllerBase
{
    private readonly ICityService _cityService;

    public CityController(ICityService cityService)
    {
        _cityService = cityService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllCities()
    {
        var cities = await _cityService.GetAllCitiesAsync();
        return Ok(cities);
    }

    [HttpPost]
    public async Task<IActionResult> AddCity([FromBody] City city)
    {
        if (city == null || string.IsNullOrEmpty(city.Name))
        {
            return BadRequest("City name is required.");
        }

        var addedCity = await _cityService.AddCityAsync(city);
        return CreatedAtAction(nameof(GetAllCities), new { id = addedCity.Id }, addedCity);
    }
    
    [HttpGet("search/{name}")]
    public async Task<IActionResult> SearchCities(string name)
    {
        var cities = await _cityService.SearchCitiesAsync(name);
        return Ok(cities);
    }
}