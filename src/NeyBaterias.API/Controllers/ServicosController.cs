using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using NeyBaterias.Application.DTOs;
using NeyBaterias.Application.Interfaces;
using NeyBaterias.Domain.Entities;
using NeyBaterias.Domain.Enums;

namespace NeyBaterias.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class ServicosController : ControllerBase
{
    private readonly IUnitOfWork _uow;

    public ServicosController(IUnitOfWork uow) => _uow = uow;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Servico>>> GetAll() =>
        Ok(await _uow.Servicos.Query().Include(s => s.Item).ToListAsync());

    [HttpGet("{id:int}")]
    public async Task<ActionResult<Servico>> GetById(int id)
    {
        var servico = await _uow.Servicos.Query()
            .Include(s => s.Item)
            .FirstOrDefaultAsync(s => s.IdServico == id);

        return servico is null ? NotFound() : Ok(servico);
    }

    [HttpPost]
    public async Task<ActionResult<Servico>> Create(CriarServicoDto dto)
    {
        var item = new Item
        {
            Descricao = dto.Descricao,
            Valor = dto.Valor,
            Tipo = TipoItem.Servico,
            Ativo = true,
            Servico = new Servico
            {
                Descricao = dto.Descricao,
                Preco = dto.Preco,
                TempoEstimado = dto.TempoEstimado
            }
        };

        await _uow.Itens.AddAsync(item);
        await _uow.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = item.Servico.IdServico }, item.Servico);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, AtualizarServicoDto dto)
    {
        var servico = await _uow.Servicos.Query()
            .Include(s => s.Item)
            .FirstOrDefaultAsync(s => s.IdServico == id);

        if (servico is null) return NotFound();

        servico.Descricao = dto.Descricao;
        servico.Preco = dto.Preco;
        servico.TempoEstimado = dto.TempoEstimado;

        servico.Item.Descricao = dto.Descricao;
        servico.Item.Valor = dto.Valor;

        _uow.Servicos.Update(servico);
        await _uow.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var servico = await _uow.Servicos.GetByIdAsync(id);
        if (servico is null) return NotFound();

        _uow.Servicos.Remove(servico);

        try
        {
            await _uow.SaveChangesAsync();
        }
        catch (DbUpdateException)
        {
            return Conflict(new { erro = "Não é possível excluir: este serviço está vinculado a vendas registradas." });
        }

        return NoContent();
    }
}