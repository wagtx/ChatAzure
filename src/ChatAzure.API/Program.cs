using ChatAzure.API.Hubs;
using ChatAzure.API.Middleware;
using ChatAzure.Core.Interfaces;
using ChatAzure.Services;
using ChatAzure.Services.Cache;
using ChatAzure.Services.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSignalR();

// Add Azure AD Authentication
builder.Services.AddAzureAdAuthentication(builder.Configuration);

// Add Application Services
builder.Services.AddScoped<IChatService, ChatService>();
builder.Services.AddScoped<IAIService, AzureAIService>();
builder.Services.AddSingleton<RedisCacheService>();
builder.Services.AddSingleton<CosmosDbService>();

// Add Application Insights
builder.Services.AddApplicationInsightsTelemetry();

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", builder =>
    {
        builder.AllowAnyOrigin()
               .AllowAnyMethod()
               .AllowAnyHeader();
    });
});

var app = builder.Build();

// Configure middleware
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowAll");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapHub<ChatHub>("/chatHub");

app.Run();
