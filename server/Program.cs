using Microsoft.EntityFrameworkCore;
using server.DataAccess;
using server.Models;

var builder = WebApplication.CreateBuilder(args);

// **1. Add Services to the Container**
builder.Services.AddControllers();

// **2. Configure Database Context**
builder.Services.AddDbContext<PaperDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString(name: "DefaultConnection")));

// Add configuration for AdminSettings
builder.Services.Configure<AdminSettings>(builder.Configuration.GetSection(key: "AdminSettings"));

// **3. Add Swagger Services**
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// **4. Add CORS Configuration**
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

// **5. Configure the HTTP Request Pipeline**
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowAll");

app.MapControllers();

app.Run();