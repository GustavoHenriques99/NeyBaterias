import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getServicos } from "../services/api";

function formatarMoeda(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function ListaServicos() {
  const [servicos, setServicos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    getServicos()
      .then(setServicos)
      .catch((err) => setErro(err.message))
      .finally(() => setCarregando(false));
  }, []);

  if (carregando) return <p className="p-4">Carregando serviços...</p>;
  if (erro) return <p className="p-4 text-red-600">Erro: {erro}</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-slate-800">Serviços</h1>
        <Link
          to="/servicos/novo"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          + Novo Serviço
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-4 py-3">Descrição</th>
              <th className="px-4 py-3">Preço</th>
              <th className="px-4 py-3">Tempo Estimado</th>
            </tr>
          </thead>
          <tbody>
            {servicos.map((s) => (
              <tr key={s.idServico} className="border-t">
                <td className="px-4 py-3">{s.descricao}</td>
                <td className="px-4 py-3">{formatarMoeda(s.preco)}</td>
                <td className="px-4 py-3">{s.tempoEstimado} min</td>
              </tr>
            ))}
          </tbody>
        </table>
        {servicos.length === 0 && (
          <p className="p-4 text-sm text-slate-400">Nenhum serviço cadastrado.</p>
        )}
      </div>
    </div>
  );
}

export default ListaServicos;