using BudgetApplication_KINGICT.Data.Models;

namespace BudgetApplication_KINGICT.Services.Interfaces;

public interface IPositionService
{
    Task<List<Position>> GetAllPositionsAsync();
    Task<Position> AddPositionAsync(Position position);
    Task<List<Position>> SearchPositionsAsync(string name);
}