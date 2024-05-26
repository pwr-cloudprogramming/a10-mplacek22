using Microsoft.AspNetCore.Authentication.JwtBearer;
using TicTacToeCloud;
using TicTacToeCloud.Hubs;
using TicTacToeCloud.Services;

var builder = WebApplication.CreateBuilder(args);
builder.Configuration.AddEnvironmentVariables();

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSignalR();
builder.Services.AddScoped<GameService, GameService>();

// CORS Configuration
var publicIp = Environment.GetEnvironmentVariable("PUBLIC_IP");
var albDnsName = Environment.GetEnvironmentVariable("ALB_DNS_NAME");
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: "AllowSpecificOrigin",
        builder =>
        {
            builder.WithOrigins(
                "http://localhost:8080",
                "http://3.235.235.222:8080",
                "http://3.235.235.222:3000",
                "http://127.0.0.1:5500",
                $"http://{publicIp}:3000",
                $"http://{publicIp}:8080",
                $"http://{albDnsName}:3000",
                $"http://{albDnsName}:8080",
                "http://mplacek22.us-east-1.elasticbeanstalk.com:8080",
                "http://mplacek22.us-east-1.elasticbeanstalk.com:3000",
                "frontend-app.us-east-1.elasticbeanstalk.com",
                "http://tictactoe-frontend.tictactoe.local:3000")
                   .AllowAnyMethod()
                   .AllowAnyHeader()
                   .AllowCredentials();
        });
});

builder.Services.AddAuthorization();
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.Authority = "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_xmzk2427v";
        options.Audience = "your-app-client-id"; // Replace with your actual App Client ID
    });

builder.Services.ConfigureOptions<JwtBearerConfigureOptions>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowSpecificOrigin");

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();
    endpoints.MapHub<GameHub>("/gameplay");
});

app.Run();
