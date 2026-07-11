import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import {
  getClientes,
  getOperadores,
  getFormasPagamento,
  getItens,
  criarVenda,
} from "../services/api";

function formatarMoeda(valor) {
  return (valor || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function CadastroVenda() {
  const [clientes, setClientes] = useState([]);
  const [operadores, setOperadores] = useState([]);
  const [formasPagamento, setFormasPagamento] = useState([]);
  const [itensDisponiveis, setItensDisponiveis] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erroCarga, setErroCarga] = useState(null);

  const [idCliente, setIdCliente] = useState("");
  const [idOperador, setIdOperador] = useState("");
  const [idPagamento, setIdPagamento] = useState("");
  const [desconto, setDesconto] = useState(0);
  const [carrinho, setCarrinho] = useState([]);

  const [idItemSelecionado, setIdItemSelecionado] = useState("");
  const [qtdSelecionada, setQtdSelecionada] = useState(1);

  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([getClientes(), getOperadores(), getFormasPagamento(), getItens()])
      .then(([clientesData, operadoresData, formasData, itensData]) => {
        setClientes(clientesData);
        setOperadores(operadoresData);
        setFormasPagamento(formasData);
        setItensDisponiveis(itensData);
      })
      .catch((err) => setErroCarga(err.message))
      .finally(() => setCarregando(false));
  }, []);

  function adicionarItem() {
    if (!idItemSelecionado || qtdSelecionada <= 0) return;

    const item = itensDisponiveis.find((i) => i.idItem === Number(idItemSelecionado));
    if (!item) return;

    setCarrinho((atual) => {
      const existente = atual.find((i) => i.idItem === item.idItem);
      if (existente) {
        return atual.map((i) =>
          i.idItem === item.idItem ? { ...i, qtd: i.qtd + Number(qtdSelecionada) } : i
        );
      }
      return [
        ...atual,
        {
          idItem: item.idItem,
          descricao: item.descricao,
          qtd: Number(qtdSelecionada),
          precoVenda: item.valor,
        },
      ];
    });

    setIdItemSelecionado("");
    setQtdSelecionada(1);
  }

  function removerItem(idItem) {
    setCarrinho((atual) => atual.filter((i) => i.idItem !== idItem));
  }

  function atualizarPrecoItem(idItem, novoPreco) {
    setCarrinho((atual) =>
      atual.map((i) => (i.idItem === idItem ? { ...i, precoVenda: Number(novoPreco) } : i))
    );
  }

  const subtotal = carrinho.reduce((soma, i) => soma + i.qtd * i.precoVenda, 0);
  const total = subtotal - Number(desconto || 0);

  async function handleSubmit(e) {
    e.preventDefault();
    setErro(null);

    if (carrinho.length === 0) {
      setErro("Adicione ao menos um item à venda.");
      return;
    }

    setSalvando(true);
    try {
      await criarVenda({
        idCliente: Number(idCliente),
        idOperador: Number(idOperador),
        idPagamento: Number(idPagamento),
        desconto: Number(desconto || 0),
        itens: carrinho.map((i) => ({
          idItem: i.idItem,
          qtd: i.qtd,
          precoVenda: i.precoVenda,
        })),
      });
      navigate("/vendas");
    } catch (err) {
      setErro(err.message);
    } finally {
      setSalvando(false);
    }
  }

  if (carregando) return <p className="p-4">Carregando dados...</p>;
  if (erroCarga) return <p className="p-4 text-red-600">Erro: {erroCarga}</p>;

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Nova Venda</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-white rounded-xl shadow-sm p-6 grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-slate-600 mb-1">Cliente</label>
            <select
              required
              value={idCliente}
              onChange={(e) => setIdCliente(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecione...</option>
              {clientes.map((c) => (
                <option key={c.idCliente} value={c.idCliente}>
                  {c.tipo === "Fisico" ? c.nome : c.razaoSocial}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-slate-600 mb-1">Operador</label>
            <select
              required
              value={idOperador}
              onChange={(e) => setIdOperador(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecione...</option>
              {operadores.map((o) => (
                <option key={o.idOperador} value={o.idOperador}>
                  {o.nome} {o.sobrenome}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-slate-600 mb-1">Forma de Pagamento</label>
            <select
              required
              value={idPagamento}
              onChange={(e) => setIdPagamento(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecione...</option>
              {formasPagamento.map((f) => (
                <option key={f.idPagamento} value={f.idPagamento}>
                  {f.descricao}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-sm font-semibold text-slate-700 mb-3">Itens da Venda</h2>

          <div className="flex gap-2 mb-4">
            <select
              value={idItemSelecionado}
              onChange={(e) => setIdItemSelecionado(e.target.value)}
              className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecione um item...</option>
              {itensDisponiveis.map((i) => (
                <option key={i.idItem} value={i.idItem}>
                  {i.descricao} — {formatarMoeda(i.valor)} ({i.tipo})
                </option>
              ))}
            </select>
            <input
              type="number"
              min="1"
              value={qtdSelecionada}
              onChange={(e) => setQtdSelecionada(e.target.value)}
              className="w-20 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={adicionarItem}
              className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-700"
            >
              Adicionar
            </button>
          </div>

          {carrinho.length > 0 ? (
            <table className="w-full text-sm">
              <thead className="text-left text-slate-500 border-b">
                <tr>
                  <th className="py-2">Item</th>
                  <th className="py-2">Qtd</th>
                  <th className="py-2">Preço Unit.</th>
                  <th className="py-2">Subtotal</th>
                  <th className="py-2"></th>
                </tr>
              </thead>
              <tbody>
                {carrinho.map((i) => (
                  <tr key={i.idItem} className="border-b last:border-0">
                    <td className="py-2">{i.descricao}</td>
                    <td className="py-2">{i.qtd}</td>
                    <td className="py-2">
                      <input
                        type="number"
                        step="0.01"
                        value={i.precoVenda}
                        onChange={(e) => atualizarPrecoItem(i.idItem, e.target.value)}
                        className="w-24 border border-slate-300 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </td>
                    <td className="py-2">{formatarMoeda(i.qtd * i.precoVenda)}</td>
                    <td className="py-2">
                      <button
                        type="button"
                        onClick={() => removerItem(i.idItem)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-sm text-slate-400">Nenhum item adicionado ainda.</p>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 flex justify-end">
          <div className="w-64 space-y-2">
            <div className="flex justify-between text-sm text-slate-600">
              <span>Subtotal</span>
              <span>{formatarMoeda(subtotal)}</span>
            </div>
            <div className="flex justify-between items-center text-sm text-slate-600">
              <span>Desconto</span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={desconto}
                onChange={(e) => setDesconto(e.target.value)}
                className="w-28 border border-slate-300 rounded-lg px-2 py-1 text-sm text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex justify-between text-base font-bold text-slate-800 pt-2 border-t">
              <span>Total</span>
              <span>{formatarMoeda(total)}</span>
            </div>
          </div>
        </div>

        {erro && <p className="text-sm text-red-600">{erro}</p>}

        <button
          type="submit"
          disabled={salvando}
          className="w-full bg-blue-600 text-white rounded-lg py-2 font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {salvando ? "Salvando..." : "Finalizar Venda"}
        </button>
      </form>
    </div>
  );
}

export default CadastroVenda;