import { Link } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { getServicos, deletarServico } from "../services/api";
import { useFiltroLista } from "../hooks/useFiltroLista";
import BarraBusca from "../components/BarraBusca";
import Paginacao from "../components/Paginacao";
import ConfirmarExclusao from "../components/ConfirmarExclusao";

function formatarMoeda(valor) {
  return (valor || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function ListaServico() {
  const [servicos, setServicos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [itemParaExcluir, setItemParaExcluir] = useState(null);
  const [excluindo, setExcluindo] = useState(false);

  function carregar() {
    setCarregando(true);
    getServicos()
      .then(setServicos)
      .catch((err) => setErro(err.message))
      .finally(() => setCarregando(false));
  }

  useEffect(() => { carregar(); }, []);

  const obterCampoOrdenacao = useCallback((s) => s.descricao || "", []);
  const { busca, setBusca, ordem, alternarOrdem, pagina, setPagina, totalPaginas, itensPaginados, totalFiltrados, itensPorPagina } =
    useFiltroLista(servicos, obterCampoOrdenacao);

  async function confirmarExclusao() {
    setExcluindo(true);
    try {
      await deletarServico(itemParaExcluir.idServico);
      setItemParaExcluir(null);
      carregar();
    } catch (err) {
      setErro(err.message);
    } finally {
      setExcluindo(false);
    }
  }

  if (carregando) return <p className="p-4">Carregando serviços...</p>;
  if (erro) return <p className="p-4 text-red-600">Erro: {erro}</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-slate-800">Serviços</h1>
        <Link to="/servicos/novo" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
          + Novo Serviço
        </Link>
      </div>

      <BarraBusca busca={busca} onBuscaChange={setBusca} ordem={ordem} onAlternarOrdem={alternarOrdem} placeholder="Pesquisar serviço pelo nome..." />

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-4 py-3">Descrição</th>
              <th className="px-4 py-3">Preço</th>
              <th className="px-4 py-3">Tempo Estimado</th>
              <th className="px-4 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {itensPaginados.map((s) => (
              <tr key={s.idServico} className="border-t">
                <td className="px-4 py-3">{s.descricao}</td>
                <td className="px-4 py-3">{formatarMoeda(s.preco)}</td>
                <td className="px-4 py-3">{s.tempoEstimado} min</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-1">
                    <Link to={`/servicos/${s.idServico}/editar`} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500">
                      <Pencil size={16} />
                    </Link>
                    <button onClick={() => setItemParaExcluir(s)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {itensPaginados.length === 0 && <p className="p-4 text-sm text-slate-400">Nenhum serviço encontrado.</p>}
        <Paginacao pagina={pagina} totalPaginas={totalPaginas} onPaginaChange={setPagina} totalFiltrados={totalFiltrados} itensPorPagina={itensPorPagina} />
      </div>

      <ConfirmarExclusao
        aberto={!!itemParaExcluir}
        titulo="Excluir serviço"
        mensagem={`Deseja excluir "${itemParaExcluir?.descricao}"?`}
        onConfirmar={confirmarExclusao}
        onCancelar={() => setItemParaExcluir(null)}
        excluindo={excluindo}
      />
    </div>
  );
}

export default ListaServico;