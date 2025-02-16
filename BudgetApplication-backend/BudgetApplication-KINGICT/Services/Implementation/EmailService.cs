using BudgetApplication_KINGICT.Data.Models;
using BudgetApplication_KINGICT.Services.Interfaces;

namespace BudgetApplication_KINGICT.Services.Implementation;

using Microsoft.Extensions.Configuration;
using System;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;

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
            var host = _configuration["EmailOptions:Host"];
            var port = int.Parse(_configuration["EmailOptions:Port"]);
            var sender = _configuration["EmailOptions:SenderEmail"];

            var password = Environment.GetEnvironmentVariable("EmailOptionsPassword");

            using var smtpClient = new SmtpClient(host, port)
            {
                Credentials = new NetworkCredential(sender, password),
                EnableSsl = true,
                DeliveryMethod = SmtpDeliveryMethod.Network
            };

            var message = new MailMessage
            {
                From = new MailAddress(sender),
                Subject = request.Subject,
                Body = request.Body,
                IsBodyHtml = false
            };
            message.To.Add(request.To);

            await smtpClient.SendMailAsync(message);

            return new EmailResponse(true, $"Email sent to {request.To}");
        }
        catch (Exception ex)
        {
            return new EmailResponse(false, ex.GetBaseException().Message);
        }
    }
}