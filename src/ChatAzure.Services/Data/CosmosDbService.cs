using Microsoft.Azure.Cosmos;

using ChatAzure.Core.Models;

using Microsoft.Extensions.Configuration;

using Microsoft.Extensions.Logging;

namespace ChatAzure.Services.Data;

public class CosmosDbService
{
    private readonly Container _container;
    private readonly ILogger<CosmosDbService> _logger;

    public CosmosDbService(IConfiguration configuration, ILogger<CosmosDbService> logger)
    {
        var connectionString = configuration["CosmosDb:ConnectionString"] ?? 
            throw new ArgumentNullException("CosmosDb:ConnectionString configuration is missing");
        var databaseName = configuration["CosmosDb:DatabaseName"] ?? "ChatDb";
        var containerName = configuration["CosmosDb:ContainerName"] ?? "Messages";

        var client = new CosmosClient(
            connectionString,
            new CosmosClientOptions 
            { 
                SerializerOptions = new CosmosSerializationOptions 
                { 
                    PropertyNamingPolicy = CosmosPropertyNamingPolicy.CamelCase 
                } 
            }
        );
        
        var database = client.GetDatabase(databaseName);
        _container = database.GetContainer(containerName);
        _logger = logger;
    }

    public async Task<ChatMessage> SaveMessageAsync(ChatMessage message)
    {
        try
        {
            var response = await _container.CreateItemAsync(
                message,
                new PartitionKey(message.SessionId)
            );
            return response.Resource;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error saving message {MessageId} to Cosmos DB", message.MessageId);
            throw;
        }
    }

    public async Task<IEnumerable<ChatMessage>> GetSessionMessagesAsync(string sessionId)
    {
        try
        {
            var query = _container.GetItemQueryIterator<ChatMessage>(
                new QueryDefinition("SELECT * FROM c WHERE c.sessionId = @sessionId ORDER BY c.timestamp")
                    .WithParameter("@sessionId", sessionId));

            var messages = new List<ChatMessage>();
            while (query.HasMoreResults)
            {
                var response = await query.ReadNextAsync();
                messages.AddRange(response);
            }
            return messages;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving messages for session {SessionId} from Cosmos DB", sessionId);
            throw;
        }
    }

    public async Task DeleteMessageAsync(string messageId, string sessionId)
    {
        try
        {
            await _container.DeleteItemAsync<ChatMessage>(
                messageId,
                new PartitionKey(sessionId)
            );
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting message {MessageId} from Cosmos DB", messageId);
            throw;
        }
    }
} 


