using BudgetApplication_KINGICT.Data.Models;
using BudgetApplication_KINGICT.Repositories.Interfaces;
using BudgetApplication_KINGICT.Services.Interfaces;

namespace BudgetApplication_KINGICT.Services.Implementation;

public class PositionService : IPositionService
{
    private readonly IPositionRepository _positionRepository;

    public PositionService(IPositionRepository positionRepository)
    {
        _positionRepository = positionRepository;
    }

    public async Task<List<Position>> GetAllPositionsAsync()
    {
        return await _positionRepository.GetAllPositionsAsync();
    }

    public async Task<Position> AddPositionAsync(Position position)
    {
        return await _positionRepository.AddPositionAsync(position);
    }
    
    public async Task<List<Position>> SearchPositionsAsync(string name)
    {
        return await _positionRepository.SearchPositionsAsync(name);
    }
    
}