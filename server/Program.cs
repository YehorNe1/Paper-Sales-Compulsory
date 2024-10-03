using Microsoft.EntityFrameworkCore;
using server.DataAccess;
using server.Models;

var builder = WebApplication.CreateBuilder(args);

// **1. Add Services to the Container**
builder.Services.AddControllers();

// **2. Configure Database Context**
builder.Services.AddDbContext<PaperDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add configuration for AdminSettings
builder.Services.Configure<AdminSettings>(builder.Configuration.GetSection("AdminSettings"));

// **3. Add Swagger Services**
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// **4. Configure the HTTP Request Pipeline**
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.MapControllers();

app.Run();