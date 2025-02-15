using BudgetApplication_KINGICT.Data.Models;
using BudgetApplication_KINGICT.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace BudgetApplication_KINGICT.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PositionController : ControllerBase
{
    private readonly IPositionService _positionService;

    public PositionController(IPositionService positionService)
    {
        _positionService = positionService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllPositions()
    {
        var positions = await _positionService.GetAllPositionsAsync();
        return Ok(positions);
    }

    [HttpPost]
    public async Task<IActionResult> AddPosition([FromBody] Position position)
    {
        if (position == null || string.IsNullOrEmpty(position.Name))
        {
            return BadRequest("Position name is required.");
        }

        var addedPosition = await _positionService.AddPositionAsync(position);
        return CreatedAtAction(nameof(GetAllPositions), new { id = addedPosition.Id }, addedPosition);
    }
    
    
    
    [HttpGet("search/{name}")]
    public async Task<IActionResult> SearchPositions(string name)
    {
        var positions = await _positionService.SearchPositionsAsync(name);
        return Ok(positions);
    }
    
}