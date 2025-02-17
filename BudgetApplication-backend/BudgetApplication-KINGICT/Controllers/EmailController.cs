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

   
}
