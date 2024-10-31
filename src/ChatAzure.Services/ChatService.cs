using ChatAzure.Core.Interfaces;
using ChatAzure.Core.Models;
using ChatAzure.Services.Cache;
using ChatAzure.Services.Data;
using Microsoft.Extensions.Logging;

namespace ChatAzure.Services;

public class ChatService : IChatService
{
    private readonly RedisCacheService _cache;
    private readonly CosmosDbService _cosmosDb;
    private readonly IAIService _aiService;
    private readonly ILogger<ChatService> _logger;

    public ChatService(
        RedisCacheService cache,
        CosmosDbService cosmosDb,
        IAIService aiService,
        ILogger<ChatService> logger)
    {
        _cache = cache;
        _cosmosDb = cosmosDb;
        _aiService = aiService;
        _logger = logger;
    }

    public async Task<ChatSession> CreateSessionAsync(string userId)
    {
        var session = new ChatSession { UserId = userId };
        await _cache.SetSessionAsync(session);
        _logger.LogInformation("Created new session {SessionId} for user {UserId}", session.SessionId, userId);
        return session;
    }

    public async Task<ChatSession?> GetSessionAsync(string sessionId)
    {
        var session = await _cache.GetSessionAsync(sessionId);
        if (session == null) return null;

        try
        {
            // Load messages from Cosmos DB
            session.Messages = (await _cosmosDb.GetSessionMessagesAsync(sessionId)).ToList();
            return session;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error loading messages for session {SessionId}", sessionId);
            throw;
        }
    }

    public async Task<ChatMessage> SendMessageAsync(string sessionId, ChatMessage message)
    {
        var session = await GetSessionAsync(sessionId) 
            ?? throw new InvalidOperationException($"Session {sessionId} not found");

        try
        {
            // Validate message
            if (!await _aiService.ValidateMessageAsync(message))
            {
                throw new InvalidOperationException("Message validation failed");
            }

            message.SessionId = sessionId;
            
            // Save user message
            await _cosmosDb.SaveMessageAsync(message);
            
            // Generate AI response
            var aiResponse = await _aiService.GenerateResponseAsync(message, session.Context);
            aiResponse.SessionId = sessionId;
            
            // Apply customizations
            await _aiService.ApplyCustomizationsAsync(aiResponse, session.Context.CustomizationRules);
            
            // Save AI response
            await _cosmosDb.SaveMessageAsync(aiResponse);
            
            // Update session
            session.Messages.Add(message);
            session.Messages.Add(aiResponse);
            session.LastActiveTime = DateTime.UtcNow;
            await _cache.SetSessionAsync(session);

            return aiResponse;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing message for session {SessionId}", sessionId);
            throw;
        }
    }

    public async Task<IEnumerable<ChatMessage>> GetMessagesAsync(string sessionId)
    {
        try
        {
            return await _cosmosDb.GetSessionMessagesAsync(sessionId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving messages for session {SessionId}", sessionId);
            throw;
        }
    }

    public async Task DeleteSessionAsync(string sessionId)
    {
        try
        {
            await _cache.RemoveSessionAsync(sessionId);
            _logger.LogInformation("Deleted session {SessionId}", sessionId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting session {SessionId}", sessionId);
            throw;
        }
    }
} 


