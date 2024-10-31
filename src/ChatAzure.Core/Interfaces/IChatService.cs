namespace ChatAzure.Core.Interfaces;

public interface IChatService
{
    Task<ChatSession> CreateSessionAsync(string userId);
    Task<ChatSession?> GetSessionAsync(string sessionId);
    Task<ChatMessage> SendMessageAsync(string sessionId, ChatMessage message);
    Task<IEnumerable<ChatMessage>> GetMessagesAsync(string sessionId);
    Task DeleteSessionAsync(string sessionId);
} 


