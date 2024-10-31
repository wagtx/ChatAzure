namespace ChatAzure.Core.Models;

public class ChatSession
{
    public string SessionId { get; set; } = Guid.NewGuid().ToString();
    public string UserId { get; set; } = string.Empty;
    public DateTime StartTime { get; set; } = DateTime.UtcNow;
    public DateTime LastActiveTime { get; set; } = DateTime.UtcNow;
    public List<ChatMessage> Messages { get; set; } = new();
    public SessionContext Context { get; set; } = new();
}

public class SessionContext
{
    public Dictionary<string, object> CustomizationRules { get; set; } = new();
    public Dictionary<string, object> UserPreferences { get; set; } = new();
    public List<string> ActiveFeatures { get; set; } = new();
} 


