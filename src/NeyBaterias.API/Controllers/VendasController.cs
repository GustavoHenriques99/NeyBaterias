using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using NeyBaterias.Application.DTOs;
using NeyBaterias.Application.Interfaces;
using NeyBaterias.Domain.Entities;

namespace NeyBaterias.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class VendasController : ControllerBase
{
    private readonly IUnitOfWork _uow;
    private readonly IVendaService _vendaService;

    public VendasController(IUnitOfWork uow, IVendaService vendaService)
    {
        _uow = uow;
        _vendaService = vendaService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<VendaRespostaDto>>> GetAll()
    {
        var vendas = await _uow.Vendas.Query()
            .Include(v => v.Cliente).ThenInclude(c => c.ClienteFisico)
            .Include(v => v.Cliente).ThenInclude(c => c.ClienteJuridico)
            .Include(v => v.Operador)
            .Include(v => v.FormaPagamento)
            .Include(v => v.ItensVenda).ThenInclude(iv => iv.Item)
            .OrderByDescending(v => v.DataVenda)
            .ToListAsync();

        return Ok(vendas.Select(MapearParaDto));
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<VendaRespostaDto>> GetById(int id)
    {
        var venda = await _uow.Vendas.Query()
            .Include(v => v.Cliente).ThenInclude(c => c.ClienteFisico)
            .Include(v => v.Cliente).ThenInclude(c => c.ClienteJuridico)
            .Include(v => v.Operador)
            .Include(v => v.FormaPagamento)
            .Include(v => v.ItensVenda).ThenInclude(iv => iv.Item)
            .FirstOrDefaultAsync(v => v.IdVenda == id);

        return venda is null ? NotFound() : Ok(MapearParaDto(venda));
    }

    [HttpPost]
    public async Task<IActionResult> Create(CriarVendaDto dto)
    {
        try
        {
            var venda = await _vendaService.RegistrarVendaAsync(dto);
            var vendaCompleta = await _uow.Vendas.Query()
                .Include(v => v.Cliente).ThenInclude(c => c.ClienteFisico)
                .Include(v => v.Cliente).ThenInclude(c => c.ClienteJuridico)
                .Include(v => v.Operador)
                .Include(v => v.FormaPagamento)
                .Include(v => v.ItensVenda).ThenInclude(iv => iv.Item)
                .FirstAsync(v => v.IdVenda == venda.IdVenda);

            return CreatedAtAction(nameof(GetById), new { id = venda.IdVenda }, MapearParaDto(vendaCompleta));
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { erro = ex.Message });
        }
    }


    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            await _vendaService.ExcluirVendaAsync(id);
            return NoContent();
        }
        catch (InvalidOperationException ex)
        {
            return NotFound(new { erro = ex.Message });
        }
    }


    private static VendaRespostaDto MapearParaDto(Venda venda)
    {
        var clienteNome = venda.Cliente.ClienteFisico?.Nome
            ?? venda.Cliente.ClienteJuridico?.RazaoSocial
            ?? "Cliente";

        return new VendaRespostaDto
        {
            IdVenda = venda.IdVenda,
            DataVenda = venda.DataVenda,
            PrecoVenda = venda.PrecoVenda,
            Desconto = venda.Desconto,
            PrecoTotal = venda.PrecoTotal,
            ClienteNome = clienteNome,
            OperadorNome = $"{venda.Operador.Nome} {venda.Operador.Sobrenome}",
            FormaPagamentoDescricao = venda.FormaPagamento.Descricao,
            Itens = venda.ItensVenda.Select(iv => new ItemVendaRespostaDto
            {
                IdItemVenda = iv.IdItemVenda,
                IdItem = iv.IdItem,
                Descricao = iv.Item.Descricao,
                Qtd = iv.Qtd,
                PrecoVenda = iv.PrecoVenda
            }).ToList()
        };
    }
}