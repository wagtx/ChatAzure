using Azure.AI.OpenAI;

using ChatAzure.Core.Interfaces;

using ChatAzure.Core.Models;

using Microsoft.Extensions.Configuration;

using Microsoft.Extensions.Logging;

namespace ChatAzure.Services;

public class AzureAIService : IAIService
{
    private readonly OpenAIClient _client;
    private readonly string _deploymentName;
    private readonly ILogger<AzureAIService> _logger;

    public AzureAIService(IConfiguration configuration, ILogger<AzureAIService> logger)
    {
        var endpoint = configuration["AzureAI:Endpoint"] ?? 
            throw new ArgumentNullException("AzureAI:Endpoint configuration is missing");
        var key = configuration["AzureAI:Key"] ?? 
            throw new ArgumentNullException("AzureAI:Key configuration is missing");
        _deploymentName = configuration["AzureAI:DeploymentName"] ?? "gpt-35-turbo";
        _logger = logger;
        
        _client = new OpenAIClient(new Uri(endpoint), new Azure.AzureKeyCredential(key));
    }

    public async Task<ChatMessage> GenerateResponseAsync(ChatMessage message, SessionContext context)
    {
        try
        {
            var chatCompletionsOptions = new ChatCompletionsOptions
            {
                Messages =
                {
                    new ChatMessage(ChatRole.System, GetSystemPrompt(context)),
                    new ChatMessage(ChatRole.User, message.Content)
                },
                Temperature = 0.7f,
                MaxTokens = 800,
                FrequencyPenalty = 0,
                PresencePenalty = 0
            };

            var response = await _client.GetChatCompletionsAsync(_deploymentName, chatCompletionsOptions);
            var completion = response.Value.Choices[0].Message;

            return new ChatMessage
            {
                Content = completion.Content,
                Sender = new Sender { Type = SenderType.Bot, Id = "ai-assistant" },
                Metadata = new MessageMetadata
                {
                    CustomData = new Dictionary<string, object>
                    {
                        { "model", _deploymentName },
                        { "temperature", 0.7 }
                    }
                }
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating AI response");
            throw;
        }
    }

    public async Task<bool> ValidateMessageAsync(ChatMessage message)
    {
        if (string.IsNullOrWhiteSpace(message.Content))
            return false;

        // Add content moderation if needed
        return true;
    }

    public async Task ApplyCustomizationsAsync(ChatMessage message, Dictionary<string, object> rules)
    {
        foreach (var rule in rules)
        {
            // Apply customization rules to the message
            // This could include content filtering, formatting, etc.
        }
    }

    private string GetSystemPrompt(SessionContext context)
    {
        var prompt = "You are a helpful assistant.";
        
        if (context.CustomizationRules.TryGetValue("personality", out var personality))
        {
            prompt += $"\nPersonality: {personality}";
        }

        if (context.CustomizationRules.TryGetValue("expertise", out var expertise))
        {
            prompt += $"\nExpertise: {expertise}";
        }

        return prompt;
    }
} 
