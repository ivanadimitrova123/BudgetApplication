namespace BudgetApplication_KINGICT.Data.Models;

public class EmailTemplate
{
    //i have added two templates in the database one with name Registration and one with name MonthlyReport
    public int Id { get; set; }
    public string Name { get; set; }
    public string Subject { get; set; }
    public string Body { get; set; }
}