using Microsoft.AspNetCore.Mvc;

using Microsoft.Extensions.Diagnostics.HealthChecks;



namespace ChatAzure.API.Controllers;



[ApiController]

[Route("health")]

public class HealthController : ControllerBase

{

    private readonly HealthCheckService _healthCheckService;

    private readonly ILogger<HealthController> _logger;



    public HealthController(

        HealthCheckService healthCheckService,

        ILogger<HealthController> logger)

    {

        _healthCheckService = healthCheckService;

        _logger = logger;

    }



    [HttpGet]

    public async Task<IActionResult> Get()

    {

        var report = await _healthCheckService.CheckHealthAsync();

        

        return report.Status == HealthStatus.Healthy 

            ? Ok(report) 

            : StatusCode(503, report);

    }



    [HttpGet("ready")]

    public async Task<IActionResult> GetReadiness()

    {

        var report = await _healthCheckService.CheckHealthAsync();

        

        return report.Status == HealthStatus.Healthy 

            ? Ok(report) 

            : StatusCode(503, report);

    }



    [HttpGet("live")]

    public IActionResult GetLiveness()

    {

        return Ok(new { status = "Alive" });

    }

} 
