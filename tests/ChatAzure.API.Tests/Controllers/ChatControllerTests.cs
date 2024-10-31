using ChatAzure.API.Controllers;
using ChatAzure.Core.Interfaces;
using ChatAzure.Core.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace ChatAzure.API.Tests.Controllers;

public class ChatControllerTests
{
    private readonly Mock<IChatService> _chatServiceMock;
    private readonly Mock<ILogger<ChatController>> _loggerMock;
    private readonly ChatController _controller;

    public ChatControllerTests()
    {
        _chatServiceMock = new Mock<IChatService>();
        _loggerMock = new Mock<ILogger<ChatController>>();
        _controller = new ChatController(_chatServiceMock.Object, _loggerMock.Object);
    }

    [Fact]
    public async Task CreateSession_ReturnsOkResult_WithNewSession()
    {
        // Arrange
        var userId = "testUser";
        var session = new ChatSession { UserId = userId };
        _chatServiceMock.Setup(x => x.CreateSessionAsync(userId))
            .ReturnsAsync(session);

        // Act
        var result = await _controller.CreateSession();

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var returnedSession = Assert.IsType<ChatSession>(okResult.Value);
        Assert.Equal(userId, returnedSession.UserId);
    }

    [Fact]
    public async Task GetSession_ReturnsNotFound_WhenSessionDoesNotExist()
    {
        // Arrange
        var sessionId = "nonexistent";
        _chatServiceMock.Setup(x => x.GetSessionAsync(sessionId))
            .ReturnsAsync((ChatSession)null);

        // Act
        var result = await _controller.GetSession(sessionId);

        // Assert
        Assert.IsType<NotFoundResult>(result.Result);
    }
} 


