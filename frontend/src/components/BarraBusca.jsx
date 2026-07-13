import { ArrowDownAZ, ArrowUpAZ, Search } from "lucide-react";

function BarraBusca({ busca, onBuscaChange, ordem, onAlternarOrdem, placeholder }) {
  return (
    <div className="flex gap-2 mb-4">
      <div className="relative flex-1">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          type="text"
          value={busca}
          onChange={(e) => onBuscaChange(e.target.value)}
          placeholder={placeholder || "Pesquisar..."}
          className="w-full border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <button
        type="button"
        onClick={onAlternarOrdem}
        title={ordem === "asc" ? "Ordem crescente (A-Z)" : "Ordem decrescente (Z-A)"}
        className="flex items-center gap-2 border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
      >
        {ordem === "asc" ? <ArrowDownAZ size={16} /> : <ArrowUpAZ size={16} />}
        {ordem === "asc" ? "A-Z" : "Z-A"}
      </button>
    </div>
  );
}

export default BarraBusca;