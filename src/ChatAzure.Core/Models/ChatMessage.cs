namespace ChatAzure.Core.Models;

public class ChatMessage
{
    public string MessageId { get; set; } = Guid.NewGuid().ToString();
    public string SessionId { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    public Sender Sender { get; set; } = new();
    public MessageMetadata Metadata { get; set; } = new();
}

public class Sender
{
    public string Id { get; set; } = string.Empty;
    public SenderType Type { get; set; }
}

public enum SenderType
{
    User,
    Bot
}

public class MessageMetadata
{
    public ClientInfo? ClientInfo { get; set; }
    public Dictionary<string, object> CustomData { get; set; } = new();
}

public class ClientInfo
{
    public string Platform { get; set; } = string.Empty;
    public string Version { get; set; } = string.Empty;
} 


