using Microsoft.EntityFrameworkCore;
using NeyBaterias.Application.Interfaces;
using NeyBaterias.Application.Services;
using NeyBaterias.Infrastructure.Data;
using NeyBaterias.Infrastructure.Repositories;

var builder = WebApplication.CreateBuilder(args);

// Controllers + Swagger
builder.Services.AddControllers()
    .AddJsonOptions(options =>
        {
            options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
        }
    );

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
builder.Services.AddScoped<IAuthService, AuthService>();

// CORS: em desenvolvimento libera tudo; em produção, restringe à origem do front-end
// definida na variável de ambiente Cors__OrigemPermitida (ex.: https://neybaterias.vercel.app)
var origemPermitida = builder.Configuration["Cors:OrigemPermitida"];
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        if (!string.IsNullOrWhiteSpace(origemPermitida))
        {
            policy.WithOrigins(origemPermitida).AllowAnyMethod().AllowAnyHeader();
        }
        else
        {
            policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
        }
    });
});


//Configurações de Autenticação
var jwtKey = builder.Configuration["Jwt:Key"]!;
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = Microsoft.AspNetCore.Authentication.JwtBearer.JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = Microsoft.AspNetCore.Authentication.JwtBearer.JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new Microsoft.IdentityModel.Tokens.SymmetricSecurityKey(
            System.Text.Encoding.UTF8.GetBytes(jwtKey))
    };
});


builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("Administrador", policy =>
        policy.RequireAssertion(context =>
            context.User.HasClaim(c => c.Type == "nivelAcesso") &&
            int.Parse(context.User.FindFirst("nivelAcesso")!.Value) >= 2));
});

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

app.UseCors();
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();