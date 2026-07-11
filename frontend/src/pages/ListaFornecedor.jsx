import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getFornecedores } from "../services/api";

function ListaFornecedores() {
  const [fornecedores, setFornecedores] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    getFornecedores()
      .then(setFornecedores)
      .catch((err) => setErro(err.message))
      .finally(() => setCarregando(false));
  }, []);

  if (carregando) return <p className="p-4">Carregando fornecedores...</p>;
  if (erro) return <p className="p-4 text-red-600">Erro: {erro}</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-slate-800">Fornecedores</h1>
        <Link
          to="/fornecedores/novo"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          + Novo Fornecedor
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-4 py-3">Razão Social</th>
              <th className="px-4 py-3">CNPJ</th>
              <th className="px-4 py-3">Contato</th>
              <th className="px-4 py-3">Telefone</th>
              <th className="px-4 py-3">Email</th>
            </tr>
          </thead>
          <tbody>
            {fornecedores.map((f) => (
              <tr key={f.idFornecedor} className="border-t">
                <td className="px-4 py-3">{f.razaoSocial}</td>
                <td className="px-4 py-3">{f.cnpj}</td>
                <td className="px-4 py-3">{f.contato}</td>
                <td className="px-4 py-3">{f.telefone}</td>
                <td className="px-4 py-3">{f.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {fornecedores.length === 0 && (
          <p className="p-4 text-sm text-slate-400">Nenhum fornecedor cadastrado.</p>
        )}
      </div>
    </div>
  );
}

export default ListaFornecedores;