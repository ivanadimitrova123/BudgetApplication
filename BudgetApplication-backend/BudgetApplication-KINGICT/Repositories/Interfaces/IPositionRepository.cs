using BudgetApplication_KINGICT.Data.Models;

namespace BudgetApplication_KINGICT.Repositories.Interfaces;

public interface IPositionRepository
{
        Task<List<Position>> GetAllPositionsAsync();
        Task<Position> AddPositionAsync(Position position);
        Task<List<Position>> SearchPositionsAsync(string name);

}
