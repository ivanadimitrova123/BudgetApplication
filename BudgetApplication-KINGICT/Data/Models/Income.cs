using System.ComponentModel.DataAnnotations.Schema;

namespace BudgetApplication.Models;

public class Income
{
    public int Id { get; set; }
    public int UserId { get; set; } 
    public string Month { get; set; } = string.Empty; 
    public int Year { get; set; }
    public int CategoryId { get; set; }
    [ForeignKey("CategoryId")]
    public Category? Category { get; set; }
    [Column(TypeName = "decimal(18,2)")]
    public decimal Amount { get; set; } = 0.00m;
    public string Type { get; set; } = "Real";
    
}
