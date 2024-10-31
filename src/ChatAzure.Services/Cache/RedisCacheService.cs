using StackExchange.Redis;
using System.Text.Json;
using ChatAzure.Core.Models;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace ChatAzure.Services.Cache;

public class RedisCacheService
{
    private readonly IDatabase _cache;
    private readonly ILogger<RedisCacheService> _logger;
    private readonly TimeSpan _defaultExpiry = TimeSpan.FromHours(1);

    public RedisCacheService(IConfiguration configuration, ILogger<RedisCacheService> logger)
    {
        var connectionString = configuration["Redis:ConnectionString"] ?? 
            throw new ArgumentNullException("Redis:ConnectionString configuration is missing");
        var connection = ConnectionMultiplexer.Connect(connectionString);
        _cache = connection.GetDatabase();
        _logger = logger;
    }

    public async Task<ChatSession?> GetSessionAsync(string sessionId)
    {
        try
        {
            var value = await _cache.StringGetAsync(GetKey(sessionId));
            return value.HasValue ? JsonSerializer.Deserialize<ChatSession>(value!) : null;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving session {SessionId} from Redis", sessionId);
            throw;
        }
    }

    public async Task SetSessionAsync(ChatSession session)
    {
        try
        {
            await _cache.StringSetAsync(
                GetKey(session.SessionId),
                JsonSerializer.Serialize(session),
                _defaultExpiry
            );
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error saving session {SessionId} to Redis", session.SessionId);
            throw;
        }
    }

    public async Task RemoveSessionAsync(string sessionId)
    {
        try
        {
            await _cache.KeyDeleteAsync(GetKey(sessionId));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error removing session {SessionId} from Redis", sessionId);
            throw;
        }
    }

    private static string GetKey(string sessionId) => $"chat:session:{sessionId}";
} 


