using ChatAzure.Core.Models;

using ChatAzure.Services.Cache;

using ChatAzure.Services.Data;

using Microsoft.Extensions.Logging;

using Moq;

using Xunit;



namespace ChatAzure.Services.Tests;



public class ChatServiceTests

{

    private readonly Mock<RedisCacheService> _cacheMock;

    private readonly Mock<CosmosDbService> _cosmosDbMock;

    private readonly Mock<IAIService> _aiServiceMock;

    private readonly Mock<ILogger<ChatService>> _loggerMock;

    private readonly ChatService _service;



    public ChatServiceTests()

    {

        _cacheMock = new Mock<RedisCacheService>();

        _cosmosDbMock = new Mock<CosmosDbService>();

        _aiServiceMock = new Mock<IAIService>();

        _loggerMock = new Mock<ILogger<ChatService>>();



        _service = new ChatService(

            _cacheMock.Object,

            _cosmosDbMock.Object,

            _aiServiceMock.Object,

            _loggerMock.Object

        );

    }



    [Fact]

    public async Task CreateSession_CreatesNewSession_AndStoresInCache()

    {

        // Arrange

        var userId = "testUser";



        // Act

        var session = await _service.CreateSessionAsync(userId);



        // Assert

        Assert.Equal(userId, session.UserId);

        _cacheMock.Verify(x => x.SetSessionAsync(It.Is<ChatSession>(s => s.UserId == userId)), Times.Once);

    }



    [Fact]

    public async Task GetSession_ReturnsNull_WhenSessionNotFound()

    {

        // Arrange

        var sessionId = "nonexistent";

        _cacheMock.Setup(x => x.GetSessionAsync(sessionId))

            .ReturnsAsync((ChatSession)null);



        // Act

        var result = await _service.GetSessionAsync(sessionId);



        // Assert

        Assert.Null(result);

    }

} 
