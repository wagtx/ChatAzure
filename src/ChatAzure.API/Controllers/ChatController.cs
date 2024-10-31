using ChatAzure.Core.Interfaces;
using ChatAzure.Core.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ChatAzure.API.Controllers;

[ApiController]
[Route("api/v1/chat")]
[Authorize]
public class ChatController : ControllerBase
{
    private readonly IChatService _chatService;
    private readonly ILogger<ChatController> _logger;

    public ChatController(IChatService chatService, ILogger<ChatController> logger)
    {
        _chatService = chatService;
        _logger = logger;
    }

    [HttpPost("sessions")]
    public async Task<ActionResult<ChatSession>> CreateSession()
    {
        try
        {
            var userId = User.Identity?.Name ?? throw new UnauthorizedAccessException();
            var session = await _chatService.CreateSessionAsync(userId);
            return Ok(session);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating chat session");
            return StatusCode(500, "Error creating chat session");
        }
    }

    [HttpGet("sessions/{sessionId}")]
    public async Task<ActionResult<ChatSession>> GetSession(string sessionId)
    {
        try
        {
            var session = await _chatService.GetSessionAsync(sessionId);
            if (session == null)
                return NotFound();

            if (session.UserId != User.Identity?.Name)
                return Forbid();

            return Ok(session);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving chat session");
            return StatusCode(500, "Error retrieving chat session");
        }
    }

    [HttpPost("sessions/{sessionId}/messages")]
    public async Task<ActionResult<ChatMessage>> SendMessage(string sessionId, ChatMessage message)
    {
        try
        {
            var session = await _chatService.GetSessionAsync(sessionId);
            if (session == null)
                return NotFound();

            if (session.UserId != User.Identity?.Name)
                return Forbid();

            var response = await _chatService.SendMessageAsync(sessionId, message);
            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending message");
            return StatusCode(500, "Error sending message");
        }
    }

    [HttpGet("sessions/{sessionId}/messages")]
    public async Task<ActionResult<IEnumerable<ChatMessage>>> GetMessages(string sessionId)
    {
        try
        {
            var session = await _chatService.GetSessionAsync(sessionId);
            if (session == null)
                return NotFound();

            if (session.UserId != User.Identity?.Name)
                return Forbid();

            var messages = await _chatService.GetMessagesAsync(sessionId);
            return Ok(messages);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving messages");
            return StatusCode(500, "Error retrieving messages");
        }
    }

    [HttpDelete("sessions/{sessionId}")]
    public async Task<ActionResult> DeleteSession(string sessionId)
    {
        try
        {
            var session = await _chatService.GetSessionAsync(sessionId);
            if (session == null)
                return NotFound();

            if (session.UserId != User.Identity?.Name)
                return Forbid();

            await _chatService.DeleteSessionAsync(sessionId);
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting session");
            return StatusCode(500, "Error deleting session");
        }
    }
} 


