import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getFornecedores, atualizarFornecedor } from "../services/api";

function EditarFornecedor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    getFornecedores()
      .then((lista) => {
        const f = lista.find((x) => x.idFornecedor === Number(id));
        if (!f) throw new Error("Fornecedor não encontrado.");
        setForm({
          razaoSocial: f.razaoSocial ?? "",
          cnpj: f.cnpj ?? "",
          telefone: f.telefone ?? "",
          email: f.email ?? "",
          endereco: f.endereco ?? "",
          contato: f.contato ?? "",
        });
      })
      .catch((err) => setErro(err.message));
  }, [id]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((atual) => ({ ...atual, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro(null);
    setSalvando(true);
    try {
      await atualizarFornecedor(Number(id), form);
      navigate("/fornecedores");
    } catch (err) {
      setErro(err.message);
    } finally {
      setSalvando(false);
    }
  }

  if (!form && !erro) return <p className="p-4">Carregando...</p>;
  if (erro) return <p className="p-4 text-red-600">Erro: {erro}</p>;

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Editar Fornecedor</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <Campo label="Razão Social" name="razaoSocial" value={form.razaoSocial} onChange={handleChange} />
        <Campo label="CNPJ" name="cnpj" value={form.cnpj} onChange={handleChange} />
        <Campo label="Contato" name="contato" value={form.contato} onChange={handleChange} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Campo label="Telefone" name="telefone" value={form.telefone} onChange={handleChange} />
          <Campo label="Email" name="email" type="email" value={form.email} onChange={handleChange} />
        </div>
        <Campo label="Endereço" name="endereco" value={form.endereco} onChange={handleChange} />
        {erro && <p className="text-sm text-red-600">{erro}</p>}
        <div className="flex gap-3">
          <button type="button" onClick={() => navigate("/fornecedores")}
            className="flex-1 border border-slate-300 text-slate-600 rounded-lg py-2 font-medium hover:bg-slate-50">
            Cancelar
          </button>
          <button type="submit" disabled={salvando}
            className="flex-1 bg-blue-600 text-white rounded-lg py-2 font-medium hover:bg-blue-700 disabled:opacity-50">
            {salvando ? "Salvando..." : "Salvar Alterações"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Campo({ label, name, value, onChange, type = "text" }) {
  return (
    <div>
      <label className="block text-sm text-slate-600 mb-1">{label}</label>
      <input type={type} name={name} value={value} onChange={onChange} required
        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
    </div>
  );
}

export default EditarFornecedor;