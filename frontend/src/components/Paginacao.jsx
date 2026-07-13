import { ChevronLeft, ChevronRight } from "lucide-react";

function Paginacao({ pagina, totalPaginas, onPaginaChange, totalFiltrados, itensPorPagina }) {
  if (totalFiltrados === 0) return null;

  const inicio = (pagina - 1) * itensPorPagina + 1;
  const fim = Math.min(pagina * itensPorPagina, totalFiltrados);

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t bg-slate-50 text-sm text-slate-500">
      <span>
        {inicio}–{fim} de {totalFiltrados}
      </span>

      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={pagina <= 1}
          onClick={() => onPaginaChange(pagina - 1)}
          className="flex items-center justify-center w-8 h-8 rounded-lg border border-slate-300 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="px-2">
          Página {pagina} de {totalPaginas}
        </span>
        <button
          type="button"
          disabled={pagina >= totalPaginas}
          onClick={() => onPaginaChange(pagina + 1)}
          className="flex items-center justify-center w-8 h-8 rounded-lg border border-slate-300 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

export default Paginacao;