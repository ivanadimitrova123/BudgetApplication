using BudgetApplication_KINGICT.Data.Models;

namespace BudgetApplication_KINGICT.Services.Interfaces;

using System.Threading.Tasks;

public interface IEmailService
{
    Task<EmailResponse> SendEmailAsync(EmailRequest request);
}
