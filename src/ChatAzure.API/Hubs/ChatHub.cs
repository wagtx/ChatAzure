using ChatAzure.Core.Interfaces;
using ChatAzure.Core.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace ChatAzure.API.Hubs;

[Authorize]
public class ChatHub : Hub
{
    private readonly IChatService _chatService;
    private readonly ILogger<ChatHub> _logger;

    public ChatHub(IChatService chatService, ILogger<ChatHub> logger)
    {
        _chatService = chatService;
        _logger = logger;
    }

    public override async Task OnConnectedAsync()
    {
        var sessionId = Context.GetHttpContext()?.Request.Query["sessionId"].ToString();
        if (!string.IsNullOrEmpty(sessionId))
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, sessionId);
        }
        await base.OnConnectedAsync();
    }

    public async Task SendMessage(string sessionId, ChatMessage message)
    {
        try
        {
            var session = await _chatService.GetSessionAsync(sessionId);
            if (session == null || session.UserId != Context.User?.Identity?.Name)
            {
                throw new UnauthorizedAccessException();
            }

            message.Sender = new Sender 
            { 
                Id = Context.User?.Identity?.Name ?? "anonymous",
                Type = SenderType.User 
            };

            var response = await _chatService.SendMessageAsync(sessionId, message);
            await Clients.Group(sessionId).SendAsync("ReceiveMessage", response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending message through SignalR");
            await Clients.Caller.SendAsync("Error", "Failed to send message");
        }
    }

    public async Task StartTyping(string sessionId)
    {
        await Clients.OthersInGroup(sessionId).SendAsync("UserTyping", Context.ConnectionId);
    }

    public async Task StopTyping(string sessionId)
    {
        await Clients.OthersInGroup(sessionId).SendAsync("UserStoppedTyping", Context.ConnectionId);
    }
} 


