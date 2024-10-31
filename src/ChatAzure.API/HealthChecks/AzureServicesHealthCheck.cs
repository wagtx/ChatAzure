using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace ChatAzure.API.HealthChecks;

public class AzureServicesHealthCheck : IHealthCheck
{
    private readonly IAIService _aiService;
    private readonly RedisCacheService _cacheService;
    private readonly CosmosDbService _cosmosDbService;

    public AzureServicesHealthCheck(
        IAIService aiService,
        RedisCacheService cacheService,
        CosmosDbService cosmosDbService)
    {
        _aiService = aiService;
        _cacheService = cacheService;
        _cosmosDbService = cosmosDbService;
    }

    public async Task<HealthCheckResult> CheckHealthAsync(HealthCheckContext context, CancellationToken cancellationToken = default)
    {
        var isHealthy = true;
        var data = new Dictionary<string, object>();

        try
        {
            // Check AI Service
            var aiMessage = new ChatMessage { Content = "Health check" };
            await _aiService.ValidateMessageAsync(aiMessage);
            data.Add("AzureAI", "Healthy");
        }
        catch (Exception ex)
        {
            isHealthy = false;
            data.Add("AzureAI", $"Unhealthy: {ex.Message}");
        }

        try
        {
            // Check Redis
            var testKey = "health-check";
            await _cacheService.SetSessionAsync(new ChatSession { SessionId = testKey });
            await _cacheService.RemoveSessionAsync(testKey);
            data.Add("Redis", "Healthy");
        }
        catch (Exception ex)
        {
            isHealthy = false;
            data.Add("Redis", $"Unhealthy: {ex.Message}");
        }

        try
        {
            // Check Cosmos DB
            await _cosmosDbService.GetSessionMessagesAsync("health-check");
            data.Add("CosmosDB", "Healthy");
        }
        catch (Exception ex)
        {
            isHealthy = false;
            data.Add("CosmosDB", $"Unhealthy: {ex.Message}");
        }

        return isHealthy
            ? HealthCheckResult.Healthy("All services are healthy", data)
            : HealthCheckResult.Unhealthy("One or more services are unhealthy", null, data);
    }
} 
