using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using NeyBaterias.Application.DTOs;
using NeyBaterias.Application.Interfaces;

namespace NeyBaterias.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class ItensController : ControllerBase
{
    private readonly IUnitOfWork _uow;

    public ItensController(IUnitOfWork uow) => _uow = uow;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ItemRespostaDto>>> GetAll()
    {
        var itens = await _uow.Itens.Query().Where(i => i.Ativo).ToListAsync();

        var resposta = itens.Select(i => new ItemRespostaDto
        {
            IdItem = i.IdItem,
            Descricao = i.Descricao,
            Valor = i.Valor,
            Tipo = i.Tipo.ToString()
        });

        return Ok(resposta);
    }
}