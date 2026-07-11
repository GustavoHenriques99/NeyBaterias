import { useEffect, useState } from "react";
import { Package, Boxes, ShoppingCart, AlertTriangle } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { getProdutos, getVendas, getSaldoEstoque } from "../services/api";
import CardResumo from "../components/CardResumo";

const LIMITE_ESTOQUE_BAIXO = 10;

function Dashboard() {
  const [produtos, setProdutos] = useState([]);
  const [vendas, setVendas] = useState([]);
  const [saldos, setSaldos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    Promise.all([getProdutos(), getVendas(), getSaldoEstoque()])
      .then(([produtosData, vendasData, saldosData]) => {
        setProdutos(produtosData);
        setVendas(vendasData);
        setSaldos(saldosData);
      })
      .catch((err) => console.error(err))
      .finally(() => setCarregando(false));
  }, []);

  if (carregando) return <p>Carregando dashboard...</p>;

  const estoqueTotal = saldos.reduce((soma, s) => soma + s.saldo, 0);
  const valorVendas = vendas.reduce((soma, v) => soma + v.precoTotal, 0);
  const alertasEstoque = saldos.filter((s) => s.saldo <= LIMITE_ESTOQUE_BAIXO);

  const vendasPorDia = agruparVendasPorDia(vendas);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
          subtitulo={`${vendas.length} vendas registradas`}
          icone={ShoppingCart}
          cor="bg-violet-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Tabela de produtos */}
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

        {/* Alertas de estoque */}
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

      {/* Gráfico de vendas */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <h2 className="font-semibold text-slate-800 mb-4">Vendas (últimos dias)</h2>
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
    </div>
  );
}

// Agrupa as vendas por dia (formato dd/mm) e soma o valor total de cada dia
function agruparVendasPorDia(vendas) {
  const grupos = {};

  vendas.forEach((v) => {
    const data = new Date(v.dataVenda);
    const chave = data.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
    grupos[chave] = (grupos[chave] || 0) + v.precoTotal;
  });

  return Object.entries(grupos).map(([dia, total]) => ({ dia, total }));
}

export default Dashboard;