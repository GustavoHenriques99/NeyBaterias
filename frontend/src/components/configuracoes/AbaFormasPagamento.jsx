import { useEffect, useState } from "react";
import { Pencil } from "lucide-react";
import {
  getFormasPagamento,
  criarFormaPagamento,
  atualizarFormaPagamento,
} from "../../services/api";

const FORM_INICIAL = { descricao: "" };

function AbaFormasPagamento() {
  const [formas, setFormas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  const [mostrarForm, setMostrarForm] = useState(false);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState(FORM_INICIAL);
  const [salvando, setSalvando] = useState(false);

  function carregar() {
    setCarregando(true);
    getFormasPagamento()
      .then(setFormas)
      .catch((err) => setErro(err.message))
      .finally(() => setCarregando(false));
  }

  useEffect(() => {
    carregar();
  }, []);

  function abrirNovo() {
    setEditando(null);
    setForm(FORM_INICIAL);
    setMostrarForm(true);
  }

  function abrirEdicao(forma) {
    setEditando(forma);
    setForm({ descricao: forma.descricao });
    setMostrarForm(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro(null);
    setSalvando(true);

    try {
      if (editando) {
        await atualizarFormaPagamento(editando.idPagamento, {
          idPagamento: editando.idPagamento,
          descricao: form.descricao,
        });
      } else {
        await criarFormaPagamento({ descricao: form.descricao });
      }

      setMostrarForm(false);
      carregar();
    } catch (err) {
      setErro(err.message);
    } finally {
      setSalvando(false);
    }
  }

  if (carregando) return <p className="text-slate-400">Carregando formas de pagamento...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-slate-800">Formas de Pagamento</h2>
        {!mostrarForm && (
          <button
            onClick={abrirNovo}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            + Nova Forma
          </button>
        )}
      </div>

      {erro && <p className="text-sm text-red-600 mb-4">{erro}</p>}

      {mostrarForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-sm p-6 space-y-4 mb-6 max-w-sm"
        >
          <h3 className="font-medium text-slate-800">
            {editando ? `Editando: ${editando.descricao}` : "Nova Forma de Pagamento"}
          </h3>

          <div>
            <label className="block text-sm text-slate-600 mb-1">Descrição</label>
            <input
              type="text"
              value={form.descricao}
              onChange={(e) => setForm({ descricao: e.target.value })}
              required
              placeholder="Ex: Pix, Cartão de Crédito, Boleto"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={salvando}
              className="flex-1 bg-blue-600 text-white rounded-lg py-2 font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {salvando ? "Salvando..." : "Salvar"}
            </button>
            <button
              type="button"
              onClick={() => setMostrarForm(false)}
              className="flex-1 border border-slate-300 text-slate-600 rounded-lg py-2 font-medium hover:bg-slate-50"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden max-w-lg">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-4 py-3">Descrição</th>
              <th className="px-4 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {formas.map((f) => (
              <tr key={f.idPagamento} className="border-t">
                <td className="px-4 py-3">{f.descricao}</td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => abrirEdicao(f)}
                    title="Editar"
                    className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"
                  >
                    <Pencil size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {formas.length === 0 && (
          <p className="p-4 text-sm text-slate-400">Nenhuma forma de pagamento cadastrada.</p>
        )}
      </div>
    </div>
  );
}

export default AbaFormasPagamento;