import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { getVendas } from "../services/api";
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

function ListaVenda() {
  const [vendas, setVendas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    getVendas()
      .then(setVendas)
      .catch((err) => setErro(err.message))
      .finally(() => setCarregando(false));
  }, []);

  const obterCampoOrdenacao = useCallback((v) => v.clienteNome || "", []);
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
  } = useFiltroLista(vendas, obterCampoOrdenacao);

  if (carregando) return <p className="p-4">Carregando vendas...</p>;
  if (erro) return <p className="p-4 text-red-600">Erro: {erro}</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-slate-800">Vendas</h1>
        <Link
          to="/vendas/novo"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          + Nova Venda
        </Link>
      </div>

      <BarraBusca
        busca={busca}
        onBuscaChange={setBusca}
        ordem={ordem}
        onAlternarOrdem={alternarOrdem}
        placeholder="Pesquisar venda pelo nome do cliente..."
      />

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-4 py-3">Data</th>
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Operador</th>
              <th className="px-4 py-3">Pagamento</th>
              <th className="px-4 py-3">Itens</th>
              <th className="px-4 py-3">Desconto</th>
              <th className="px-4 py-3">Total</th>
            </tr>
          </thead>
          <tbody>
            {itensPaginados.map((v) => (
              <tr key={v.idVenda} className="border-t">
                <td className="px-4 py-3">{formatarData(v.dataVenda)}</td>
                <td className="px-4 py-3">{v.clienteNome}</td>
                <td className="px-4 py-3">{v.operadorNome}</td>
                <td className="px-4 py-3">{v.formaPagamentoDescricao}</td>
                <td className="px-4 py-3">
                  {v.itens.length} {v.itens.length === 1 ? "item" : "itens"}
                </td>
                <td className="px-4 py-3">{formatarMoeda(v.desconto)}</td>
                <td className="px-4 py-3 font-medium text-slate-800">
                  {formatarMoeda(v.precoTotal)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {itensPaginados.length === 0 && (
          <p className="p-4 text-sm text-slate-400">Nenhuma venda encontrada.</p>
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

export default ListaVenda;