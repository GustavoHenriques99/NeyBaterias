import { Link } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { getComprasReposicao } from "../services/api";
import { useFiltroLista } from "../hooks/useFiltroLista";
import BarraBusca from "../components/BarraBusca";
import Paginacao from "../components/Paginacao";

function formatarMoeda(valor) {
  return (valor || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatarData(data) {
  return new Date(data).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function ListaReposicao() {
  const [reposicoes, setReposicoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    getComprasReposicao()
      .then(setReposicoes)
      .catch((err) => setErro(err.message))
      .finally(() => setCarregando(false));
  }, []);

  const obterCampoOrdenacao = useCallback((r) => r.fornecedor?.razaoSocial || "", []);
  const {
    busca,
    setBusca,
    ordem,
    alternarOrdem,
    pagina,
    setPagina,
    totalPaginas,
    itensPaginados,
    totalFiltrados,
    itensPorPagina,
  } = useFiltroLista(reposicoes, obterCampoOrdenacao);

  if (carregando) return <p className="p-4">Carregando reposições...</p>;
  if (erro) return <p className="p-4 text-red-600">Erro: {erro}</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-slate-800">Reposições de Estoque</h1>
        <Link
          to="/reposicoes/novo"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          + Nova Reposição
        </Link>
      </div>

      <BarraBusca
        busca={busca}
        onBuscaChange={setBusca}
        ordem={ordem}
        onAlternarOrdem={alternarOrdem}
        placeholder="Pesquisar reposição pelo nome do fornecedor..."
      />

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-4 py-3">Data</th>
              <th className="px-4 py-3">Fornecedor</th>
              <th className="px-4 py-3">Itens</th>
              <th className="px-4 py-3">Total</th>
            </tr>
          </thead>
          <tbody>
            {itensPaginados.map((r) => (
              <tr key={r.idReposicao} className="border-t">
                <td className="px-4 py-3">{formatarData(r.dataReposicao)}</td>
                <td className="px-4 py-3">{r.fornecedor?.razaoSocial}</td>
                <td className="px-4 py-3">
                  {r.itensReposicao.length}{" "}
                  {r.itensReposicao.length === 1 ? "produto" : "produtos"}
                </td>
                <td className="px-4 py-3 font-medium text-slate-800">
                  {formatarMoeda(r.preco)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {itensPaginados.length === 0 && (
          <p className="p-4 text-sm text-slate-400">Nenhuma reposição encontrada.</p>
        )}
        <Paginacao
          pagina={pagina}
          totalPaginas={totalPaginas}
          onPaginaChange={setPagina}
          totalFiltrados={totalFiltrados}
          itensPorPagina={itensPorPagina}
        />
      </div>
    </div>
  );
}

export default ListaReposicao;