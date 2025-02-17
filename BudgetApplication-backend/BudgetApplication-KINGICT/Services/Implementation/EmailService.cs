using BudgetApplication_KINGICT.Data.Models;
using BudgetApplication_KINGICT.Services.Interfaces;
using Azure.Communication.Email;
using Azure;

namespace BudgetApplication_KINGICT.Services.Implementation;

public class EmailService : IEmailService
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<EmailService> _logger;
    private readonly string _connectionString;
    private readonly string _senderEmail;

    public EmailService(IConfiguration configuration, ILogger<EmailService> logger)
    {
        _configuration = configuration;
        _logger = logger;
        
        _connectionString = _configuration["AzureEmail:ConnectionString"] ?? throw new ArgumentNullException("AzureEmail:ConnectionString is missing");
        _senderEmail = _configuration["AzureEmail:SenderEmail"] ?? throw new ArgumentNullException("AzureEmail:SenderEmail is missing");
    }

    public async Task<EmailResponse> SendEmailAsync(EmailRequest request)
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
    }
}