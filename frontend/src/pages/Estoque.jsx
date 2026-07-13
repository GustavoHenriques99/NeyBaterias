import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowDownCircle, ArrowUpCircle, AlertTriangle } from "lucide-react";
import { getSaldoEstoque, getMovimentosEstoque } from "../services/api";

const LIMITE_ESTOQUE_BAIXO = 5;

function formatarData(data) {
  return new Date(data).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function Estoque() {
  const [saldos, setSaldos] = useState([]);
  const [movimentos, setMovimentos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [produtoFiltro, setProdutoFiltro] = useState(null);

  useEffect(() => {
    Promise.all([getSaldoEstoque(), getMovimentosEstoque()])
      .then(([saldosData, movimentosData]) => {
        setSaldos(saldosData);
        setMovimentos(movimentosData);
      })
      .catch((err) => setErro(err.message))
      .finally(() => setCarregando(false));
  }, []);

  const movimentosFiltrados = useMemo(() => {
    if (produtoFiltro === null) return movimentos;
    return movimentos.filter((m) => m.idProduto === produtoFiltro);
  }, [movimentos, produtoFiltro]);

  if (carregando) return <p className="p-4">Carregando estoque...</p>;
  if (erro) return <p className="p-4 text-red-600">Erro: {erro}</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-slate-800">Estoque</h1>
        <Link
          to="/reposicoes"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          Ver Reposições
        </Link>
      </div>

      {/* Saldo por produto */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
        <div className="px-4 py-3 border-b">
          <h2 className="text-sm font-semibold text-slate-700">Saldo por Produto</h2>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-4 py-3">Produto</th>
              <th className="px-4 py-3">Saldo Atual</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {saldos.map((s) => {
              const baixo = s.saldo <= LIMITE_ESTOQUE_BAIXO;
              const ativo = produtoFiltro === s.idProduto;
              return (
                <tr
                  key={s.idProduto}
                  onClick={() => setProdutoFiltro(ativo ? null : s.idProduto)}
                  className={`border-t cursor-pointer hover:bg-slate-50 ${
                    ativo ? "bg-blue-50" : ""
                  }`}
                >
                  <td className="px-4 py-3">{s.descricao}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`font-medium ${
                        baixo ? "text-red-600" : "text-slate-800"
                      }`}
                    >
                      {s.saldo}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {baixo && (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-red-600">
                        <AlertTriangle size={14} />
                        Estoque baixo
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {saldos.length === 0 && (
          <p className="p-4 text-sm text-slate-400">Nenhum produto com movimentação de estoque.</p>
        )}
      </div>

      {/* Histórico de movimentações */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-700">
            Histórico de Movimentações
            {produtoFiltro !== null && (
              <span className="text-slate-400 font-normal">
                {" "}
                — filtrado por {saldos.find((s) => s.idProduto === produtoFiltro)?.descricao}
              </span>
            )}
          </h2>
          {produtoFiltro !== null && (
            <button
              onClick={() => setProdutoFiltro(null)}
              className="text-xs text-blue-600 hover:underline"
            >
              Limpar filtro
            </button>
          )}
        </div>
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-4 py-3">Data</th>
              <th className="px-4 py-3">Produto</th>
              <th className="px-4 py-3">Tipo</th>
              <th className="px-4 py-3">Qtd</th>
            </tr>
          </thead>
          <tbody>
            {movimentosFiltrados.map((m) => (
              <tr key={m.idEstoque} className="border-t">
                <td className="px-4 py-3">{formatarData(m.dataMovimento)}</td>
                <td className="px-4 py-3">{m.produto?.descricao}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                      m.tipoMovimento === "Entrada"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {m.tipoMovimento === "Entrada" ? (
                      <ArrowUpCircle size={14} />
                    ) : (
                      <ArrowDownCircle size={14} />
                    )}
                    {m.tipoMovimento}
                  </span>
                </td>
                <td className="px-4 py-3">{m.qtdMovimento}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {movimentosFiltrados.length === 0 && (
          <p className="p-4 text-sm text-slate-400">Nenhuma movimentação encontrada.</p>
        )}
      </div>
    </div>
  );
}

export default Estoque;