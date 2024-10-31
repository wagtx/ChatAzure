namespace ChatAzure.Core.Interfaces;

public interface IAIService
{
    Task<ChatMessage> GenerateResponseAsync(ChatMessage message, SessionContext context);
    Task<bool> ValidateMessageAsync(ChatMessage message);
    Task ApplyCustomizationsAsync(ChatMessage message, Dictionary<string, object> rules);
} 


