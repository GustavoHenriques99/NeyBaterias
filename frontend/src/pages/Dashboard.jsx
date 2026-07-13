import { useEffect, useMemo, useState } from "react";
import {
  Package,
  Boxes,
  ShoppingCart,
  AlertTriangle,
  TrendingUp,
  Wallet,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  getProdutos,
  getVendas,
  getSaldoEstoque,
  getComprasReposicao,
} from "../services/api";
import CardResumo from "../components/CardResumo";

const LIMITE_ESTOQUE_BAIXO = 10;

function paraInputDate(data) {
  return data.toISOString().slice(0, 10);
}

function primeiroDiaDoMes() {
  const hoje = new Date();
  return new Date(hoje.getFullYear(), hoje.getMonth(), 1);
}

function Dashboard() {
  const [produtos, setProdutos] = useState([]);
  const [vendas, setVendas] = useState([]);
  const [saldos, setSaldos] = useState([]);
  const [compras, setCompras] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const [dataInicio, setDataInicio] = useState(paraInputDate(primeiroDiaDoMes()));
  const [dataFim, setDataFim] = useState(paraInputDate(new Date()));

  useEffect(() => {
    Promise.all([getProdutos(), getVendas(), getSaldoEstoque(), getComprasReposicao()])
      .then(([produtosData, vendasData, saldosData, comprasData]) => {
        setProdutos(produtosData);
        setVendas(vendasData);
        setSaldos(saldosData);
        setCompras(comprasData);
      })
      .catch((err) => console.error(err))
      .finally(() => setCarregando(false));
  }, []);

  const { vendasFiltradas, comprasFiltradas } = useMemo(() => {
    const inicio = new Date(`${dataInicio}T00:00:00`);
    const fim = new Date(`${dataFim}T23:59:59`);

    return {
      vendasFiltradas: vendas.filter((v) => {
        const data = new Date(v.dataVenda);
        return data >= inicio && data <= fim;
      }),
      comprasFiltradas: compras.filter((c) => {
        const data = new Date(c.dataReposicao);
        return data >= inicio && data <= fim;
      }),
    };
  }, [vendas, compras, dataInicio, dataFim]);

  if (carregando) return <p>Carregando dashboard...</p>;

  const estoqueTotal = saldos.reduce((soma, s) => soma + s.saldo, 0);
  const valorVendas = vendasFiltradas.reduce((soma, v) => soma + v.precoTotal, 0);
  const valorInvestido = comprasFiltradas.reduce((soma, c) => soma + c.preco, 0);
  const alertasEstoque = saldos.filter((s) => s.saldo <= LIMITE_ESTOQUE_BAIXO);
  const vendasPorDia = agruparVendasPorDia(vendasFiltradas);
  const projecaoMes = calcularProjecaoMensal(dataInicio, dataFim, valorVendas);
  const topItens = calcularTopItens(vendasFiltradas, 5);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>

        <div className="flex items-center gap-2 text-sm">
          <label className="text-slate-500">De</label>
          <input
            type="date"
            value={dataInicio}
            onChange={(e) => setDataInicio(e.target.value)}
            className="border border-slate-300 rounded-lg px-2 py-1"
          />
          <label className="text-slate-500">Até</label>
          <input
            type="date"
            value={dataFim}
            onChange={(e) => setDataFim(e.target.value)}
            className="border border-slate-300 rounded-lg px-2 py-1"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <CardResumo
          titulo="Produtos"
          valor={produtos.length}
          subtitulo="Total cadastrado"
          icone={Package}
          cor="bg-blue-500"
        />
        <CardResumo
          titulo="Estoque Total"
          valor={estoqueTotal}
          subtitulo="Unidades disponíveis"
          icone={Boxes}
          cor="bg-emerald-500"
        />
        <CardResumo
          titulo="Vendas"
          valor={`R$ ${valorVendas.toFixed(2)}`}
          subtitulo={`${vendasFiltradas.length} vendas no período`}
          icone={ShoppingCart}
          cor="bg-violet-500"
        />
        <CardResumo
          titulo="Investimento"
          valor={`R$ ${valorInvestido.toFixed(2)}`}
          subtitulo={`${comprasFiltradas.length} reposições no período`}
          icone={Wallet}
          cor="bg-amber-500"
        />
        <CardResumo
          titulo="Projeção do Mês"
          valor={`R$ ${projecaoMes.toFixed(2)}`}
          subtitulo="Baseado na média diária"
          icone={TrendingUp}
          cor="bg-sky-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-5">
          <h2 className="font-semibold text-slate-800 mb-4">Produtos</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 border-b">
                <th className="pb-2">Produto</th>
                <th className="pb-2">Estoque</th>
                <th className="pb-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {produtos.map((p) => {
                const saldo = saldos.find((s) => s.idProduto === p.idProduto);
                const qtd = saldo?.saldo ?? 0;
                const baixo = qtd <= LIMITE_ESTOQUE_BAIXO;
                return (
                  <tr key={p.idProduto} className="border-b last:border-0">
                    <td className="py-2">{p.descricao}</td>
                    <td className="py-2">{qtd}</td>
                    <td className="py-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          baixo
                            ? "bg-red-100 text-red-700"
                            : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {baixo ? "Estoque baixo" : "Em estoque"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5">
          <h2 className="font-semibold text-slate-800 mb-4">Alertas de Estoque</h2>
          <div className="space-y-3">
            {alertasEstoque.length === 0 && (
              <p className="text-sm text-slate-400">Nenhum alerta no momento.</p>
            )}
            {alertasEstoque.map((s) => (
              <div key={s.idProduto} className="flex items-start gap-2 text-sm">
                <AlertTriangle size={16} className="text-amber-500 mt-0.5" />
                <span>
                  <strong>{s.descricao}</strong> com apenas {s.saldo} unidades
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-5">
          <h2 className="font-semibold text-slate-800 mb-4">Vendas no período</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={vendasPorDia}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="dia" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="total" stroke="#2563eb" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5">
          <h2 className="font-semibold text-slate-800 mb-4">Top 5 mais vendidos</h2>
          <div className="space-y-3">
            {topItens.length === 0 && (
              <p className="text-sm text-slate-400">Sem vendas no período.</p>
            )}
            {topItens.map((item, index) => (
              <div key={item.descricao} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 text-xs font-semibold">
                    {index + 1}
                  </span>
                  <span className="text-slate-700">{item.descricao}</span>
                </div>
                <div className="text-right">
                  <p className="font-medium text-slate-800">{item.qtdTotal} un.</p>
                  <p className="text-xs text-slate-400">R$ {item.valorTotal.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function agruparVendasPorDia(vendas) {
  const grupos = {};

  vendas.forEach((v) => {
    const data = new Date(v.dataVenda);
    const chave = data.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
    grupos[chave] = (grupos[chave] || 0) + v.precoTotal;
  });

  return Object.entries(grupos).map(([dia, total]) => ({ dia, total }));
}

// Projeção simples: pega a média de venda por dia dentro do período filtrado
// e multiplica pelo total de dias do mês corrente. Não considera sazonalidade,
// é só uma estimativa rápida de tendência.
function calcularProjecaoMensal(dataInicioStr, dataFimStr, valorVendas) {
  const inicio = new Date(`${dataInicioStr}T00:00:00`);
  const fim = new Date(`${dataFimStr}T23:59:59`);

  const diasNoPeriodo = Math.max(
    1,
    Math.round((fim - inicio) / (1000 * 60 * 60 * 24)) + 1
  );

  const mediaDiaria = valorVendas / diasNoPeriodo;

  const hoje = new Date();
  const diasNoMesAtual = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0).getDate();

  return mediaDiaria * diasNoMesAtual;
}

// Soma quantidade e valor por descrição de item entre todas as vendas filtradas,
// e devolve os N com maior valor total vendido
function calcularTopItens(vendas, limite) {
  const agregados = {};

  vendas.forEach((venda) => {
    (venda.itens || []).forEach((item) => {
      if (!agregados[item.descricao]) {
        agregados[item.descricao] = { descricao: item.descricao, qtdTotal: 0, valorTotal: 0 };
      }
      agregados[item.descricao].qtdTotal += item.qtd;
      agregados[item.descricao].valorTotal += item.qtd * item.precoVenda;
    });
  });

  return Object.values(agregados)
    .sort((a, b) => b.valorTotal - a.valorTotal)
    .slice(0, limite);
}

export default Dashboard;