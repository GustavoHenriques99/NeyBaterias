import { AlertTriangle } from "lucide-react";

function ConfirmarExclusao({ aberto, titulo, mensagem, erro, excluindo, onConfirmar, onCancelar }) {
  if (!aberto) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-full bg-red-100 text-red-600">
            <AlertTriangle size={20} />
          </div>
          <h3 className="font-semibold text-slate-800">{titulo}</h3>
        </div>

        <p className="text-sm text-slate-600 mb-4">{mensagem}</p>

        {erro && <p className="text-sm text-red-600 mb-4">{erro}</p>}

        <div className="flex gap-2">
          <button
            onClick={onConfirmar}
            disabled={excluindo}
            className="flex-1 bg-red-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-red-700 disabled:opacity-50"
          >
            {excluindo ? "Excluindo..." : "Excluir"}
          </button>
          <button
            onClick={onCancelar}
            className="flex-1 border border-slate-300 text-slate-600 rounded-lg py-2 text-sm font-medium hover:bg-slate-50"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmarExclusao;