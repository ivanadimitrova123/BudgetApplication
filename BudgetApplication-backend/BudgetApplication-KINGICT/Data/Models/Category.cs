namespace BudgetApplication_KINGICT.Data.Models;

public class Category
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    
    public string CategoryFor { get; set; } = string.Empty;

}
