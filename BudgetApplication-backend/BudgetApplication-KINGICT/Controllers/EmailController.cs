using BudgetApplication_KINGICT.Data.Models;
using BudgetApplication_KINGICT.Services.Interfaces;

namespace BudgetApplication_KINGICT.Controllers;

using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

[Route("api/email")]
[ApiController]
public class EmailController : ControllerBase
{
    private readonly IEmailService _emailService;

    public EmailController(IEmailService emailService)
    {
        _emailService = emailService;
    }

    [HttpPost("send")]
    public async Task<IActionResult> SendEmail([FromBody] EmailRequest request)
    {
        if (request == null || string.IsNullOrWhiteSpace(request.To) || string.IsNullOrWhiteSpace(request.Subject))
        {
            return BadRequest(new EmailResponse(false, "Invalid request parameters."));
        }

        try
        {
            var result = await _emailService.SendEmailAsync(request);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new EmailResponse(false, ex.GetBaseException().Message));
        }
    }
}
