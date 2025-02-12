namespace BudgetApplication.Models;

public class User
{
    public int Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public int CityId { get; set; }
    public int PositionId { get; set; }
    public int YearsInPosition { get; set; }
    public int YearsInExperience { get; set; }
    public bool IsUserActive { get; set; }
}
