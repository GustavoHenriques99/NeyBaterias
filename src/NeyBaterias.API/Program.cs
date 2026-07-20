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

builder.Services.AddEndpointsApiExplorer();.;c              bbbbbxs
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


// Sistema de níveis de acesso:
// 1 - Ler
// 2 - Ler, Cadastrar
// 3 - Ler, Cadastrar, Atualizar, Excluir
// 4 - Tudo do nível 3 + ações/campos sensíveis (gestão de operadores, senhas,
//     configurações da empresa) — exclusivo do administrador do sistema.
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("Nivel1", policy =>
        policy.RequireAssertion(context => NivelAcessoDoUsuario(context.User) >= 1));

    options.AddPolicy("Nivel2", policy =>
        policy.RequireAssertion(context => NivelAcessoDoUsuario(context.User) >= 2));

    options.AddPolicy("Nivel3", policy =>
        policy.RequireAssertion(context => NivelAcessoDoUsuario(context.User) >= 3));

    options.AddPolicy("Nivel4", policy =>
        policy.RequireAssertion(context => NivelAcessoDoUsuario(context.User) >= 4));

    // Mantido como sinônimo de Nivel4 para não quebrar código existente que
    // ainda referencia "Administrador" diretamente.
    options.AddPolicy("Administrador", policy =>
        policy.RequireAssertion(context => NivelAcessoDoUsuario(context.User) >= 4));
});


static int NivelAcessoDoUsuario(System.Security.Claims.ClaimsPrincipal user)
{
    var claim = user.FindFirst("nivelAcesso");
    return claim is not null && int.TryParse(claim.Value, out var nivel) ? nivel : 0;
}

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

app.UseCors();
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();