using Microsoft.EntityFrameworkCore;
using server.DataAccess;
using AutoMapper;
using server.Mappings;
using server.Models;
using Microsoft.AspNetCore.Server.Kestrel.Core;

var builder = WebApplication.CreateBuilder(args);

// **1. Configure Kestrel to Listen on Specific Ports**
builder.WebHost.ConfigureKestrel(options =>
{
    // Listen on HTTP port 5062
    options.ListenAnyIP(5062, listenOptions =>
    {
        listenOptions.Protocols = HttpProtocols.Http1AndHttp2;
    });

    // Listen on HTTPS port 7215
    options.ListenAnyIP(7215, listenOptions =>
    {
        listenOptions.UseHttps();
        listenOptions.Protocols = HttpProtocols.Http1AndHttp2;
    });
});

// **2. Add Services to the Container**
builder.Services.AddControllers();

// **3. Configure Database Context**
builder.Services.AddDbContext<PaperDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// **4. Register AutoMapper**
builder.Services.AddAutoMapper(typeof(MappingProfile));

// **5. Add Swagger Services**
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// **6. Add CORS Configuration**
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

var app = builder.Build();

// **7. Configure the HTTP Request Pipeline**
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowAll");

app.UseAuthorization();

app.MapControllers();

app.Run();