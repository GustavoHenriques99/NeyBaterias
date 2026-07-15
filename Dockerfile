# Etapa 1: build
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY NeyBaterias.slnx ./
COPY src/NeyBaterias.API/NeyBaterias.API.csproj src/NeyBaterias.API/
COPY src/NeyBaterias.Application/NeyBaterias.Application.csproj src/NeyBaterias.Application/
COPY src/NeyBaterias.Domain/NeyBaterias.Domain.csproj src/NeyBaterias.Domain/
COPY src/NeyBaterias.Infrastructure/NeyBaterias.Infrastructure.csproj src/NeyBaterias.Infrastructure/

RUN dotnet restore src/NeyBaterias.API/NeyBaterias.API.csproj

COPY src/ src/
RUN dotnet publish src/NeyBaterias.API/NeyBaterias.API.csproj -c Release -o /app --no-restore

# Etapa 2: runtime (imagem final, bem mais leve)
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
COPY --from=build /app .

# Render (e outros PaaS) injetam a porta via variável PORT.
# Se não vier definida (ex.: rodando local), cai em 8080.
ENV PORT=8080
EXPOSE 8080

ENTRYPOINT ["/bin/sh", "-c", "ASPNETCORE_URLS=http://+:$PORT dotnet NeyBaterias.API.dll"]