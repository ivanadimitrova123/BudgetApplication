namespace BudgetApplication.Models;

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class Expense
{
    public int Id { get; set; }
    public int UserId { get; set; } 
    public string Month { get; set; } = string.Empty; 
    public int Year { get; set; }
    public string Category { get; set; } = string.Empty; 
    [Column(TypeName = "decimal(18,2)")]
    public decimal Amount { get; set; } = 0.00m;
    public string Type { get; set; } = "Real"; 
}
