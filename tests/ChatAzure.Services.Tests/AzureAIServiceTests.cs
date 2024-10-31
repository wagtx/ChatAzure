using ChatAzure.Core.Models;
using ChatAzure.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace ChatAzure.Services.Tests;

public class AzureAIServiceTests
{
    private readonly Mock<IConfiguration> _configMock;
    private readonly Mock<ILogger<AzureAIService>> _loggerMock;
    private readonly AzureAIService _service;

    public AzureAIServiceTests()
    {
        _configMock = new Mock<IConfiguration>();
        _loggerMock = new Mock<ILogger<AzureAIService>>();

        var configSection = new Mock<IConfigurationSection>();
        configSection.Setup(x => x.Value).Returns("test-value");
        _configMock.Setup(x => x["AzureAI:Endpoint"]).Returns("https://test.openai.azure.com/");
        _configMock.Setup(x => x["AzureAI:Key"]).Returns("test-key");
        _configMock.Setup(x => x["AzureAI:DeploymentName"]).Returns("test-deployment");

        _service = new AzureAIService(_configMock.Object, _loggerMock.Object);
    }

    [Fact]
    public async Task ValidateMessageAsync_ReturnsFalse_ForEmptyContent()
    {
        // Arrange
        var message = new ChatMessage { Content = "" };

        // Act
        var result = await _service.ValidateMessageAsync(message);

        // Assert
        Assert.False(result);
    }

    [Fact]
    public async Task ValidateMessageAsync_ReturnsTrue_ForValidContent()
    {
        // Arrange
        var message = new ChatMessage { Content = "Test message" };

        // Act
        var result = await _service.ValidateMessageAsync(message);

        // Assert
        Assert.True(result);
    }
} 