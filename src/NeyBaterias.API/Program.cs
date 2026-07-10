using Microsoft.EntityFrameworkCore;
using NeyBaterias.Application.Interfaces;
using NeyBaterias.Application.Services;
using NeyBaterias.Infrastructure.Data;
using NeyBaterias.Infrastructure.Repositories;

var builder = WebApplication.CreateBuilder(args);

// Controllers + Swagger
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { Title = "NeyBaterias API", Version = "v1" });
});

// DbContext (PostgreSQL)
builder.Services.AddDbContext<NeyBateriasDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"))
           .UseSnakeCaseNamingConvention());

// Injeção de dependência
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddScoped<IVendaService, VendaService>();
builder.Services.AddScoped<ICompraReposicaoService, CompraReposicaoService>();

// CORS liberado para desenvolvimento (ajustar em produção)
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
        policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors();
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();
