using BudgetApplication_KINGICT.Data.Models;
using BudgetApplication_KINGICT.Services.Interfaces;
using Azure.Communication.Email;
using Azure;

namespace BudgetApplication_KINGICT.Services.Implementation;

public class EmailService : IEmailService
{
    private readonly IConfiguration _configuration;

    public EmailService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public async Task<EmailResponse> SendEmailAsync(EmailRequest request)
    {
        try
        {
            //add this in app settings json swith comment comentar 
            string connectionString = "endpoint=https://email-sender-resource.europe.communication.azure.com/;accesskey=6HTBaNhAN5SsrAlPbtc6e28Kws7U3l43Xx1bPzpSfFD8nGswuN6KJQQJ99BBACULyCpvWPRoAAAAAZCSOqVQ";
            var emailClient = new EmailClient(connectionString);

            var emailMessage = new EmailMessage(
                //add in app settings jsont
                senderAddress: "DoNotReply@bc6f26a0-6735-4585-a59f-49d8f066feb5.azurecomm.net",
                //subject
                content: new EmailContent("Test Email")
                {
                    //?
                    PlainText = "Hello",
                    //body
                    Html = @"
		                    <html>
			                    <body>
				                    <h1>Hello world via email.</h1>
			                    </body>
		                    </html>"
                },
                recipients: new EmailRecipients(new List<EmailAddress> { new EmailAddress("ivanadimitrova23@gmail.com") }));
    

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