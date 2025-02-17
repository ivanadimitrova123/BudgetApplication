using BudgetApplication_KINGICT.Data.Models;
using BudgetApplication_KINGICT.Services.Interfaces;
using Azure.Communication.Email;
using Azure;
using BudgetApplication_KINGICT.Data;

namespace BudgetApplication_KINGICT.Services.Implementation;

public class EmailService : IEmailService
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<EmailService> _logger;
    private readonly string _connectionString;
    private readonly string _senderEmail;
    private readonly ApplicationDbContext _context;

    public EmailService(IConfiguration configuration, ILogger<EmailService> logger, ApplicationDbContext context)
    {
        _configuration = configuration;
        _logger = logger;
        _context = context;
        _connectionString = _configuration["AzureEmail:ConnectionString"] ?? throw new ArgumentNullException("AzureEmail:ConnectionString is missing");
        _senderEmail = _configuration["AzureEmail:SenderEmail"] ?? throw new ArgumentNullException("AzureEmail:SenderEmail is missing");
    }

   /* public async Task<EmailResponse> SendEmailAsync(EmailRequest request)
    {
        try
        {
           var emailClient = new EmailClient(_connectionString);

            var emailMessage = new EmailMessage(
                senderAddress: _senderEmail,
                content: new EmailContent(request.Subject)
                {
                    PlainText = request.Body,
                    Html = $@"
                        <html>
                            <body>
                                <h1>{request.Body}</h1>
                            </body>
                        </html>"
                },
                recipients: new EmailRecipients(new List<EmailAddress> { new EmailAddress(request.To) }));
    

            EmailSendOperation emailSendOperation = emailClient.Send(
                WaitUntil.Completed,
                emailMessage);


            return new EmailResponse(true, $"Email sent to {request.To}");
        }
        catch (Exception ex)
        {
            return new EmailResponse(false, ex.GetBaseException().Message);
        }
    }*/

   public async Task<EmailResponse> SendEmailAsync(string email, string templateName, Dictionary<string, string> placeholders)
   {
       try
       {
           var template = _context.EmailTemplates.FirstOrDefault(t => t.Name == templateName);
           if (template == null)
           {
               return new EmailResponse(false, "Email template not found.");
           }

           string emailBody = template.Body;
           foreach (var placeholder in placeholders)
           {
               emailBody = emailBody.Replace($"{{{placeholder.Key}}}", placeholder.Value);
           }

           string connectionString = _connectionString;
           var emailClient = new EmailClient(connectionString);

           var emailMessage = new EmailMessage(
               senderAddress: _senderEmail,
               content: new EmailContent(template.Subject)
               {
                   PlainText = emailBody,
                   Html = emailBody
               },
               recipients: new EmailRecipients(new List<EmailAddress> { new EmailAddress(email) })
           );

           EmailSendOperation emailSendOperation = emailClient.Send(WaitUntil.Completed, emailMessage);

           return new EmailResponse(true, $"Email sent to {email}");
       }
       catch (Exception ex)
       {
           return new EmailResponse(false, ex.GetBaseException().Message);
       }
   }
}
    
      