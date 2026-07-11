import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { criarFornecedor } from "../services/api";

const FORM_INICIAL = {
  razaoSocial: "",
  cnpj: "",
  telefone: "",
  email: "",
  endereco: "",
  contato: "",
};

function CadastroFornecedor() {
  const [form, setForm] = useState(FORM_INICIAL);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState(null);
  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((atual) => ({ ...atual, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro(null);
    setSalvando(true);

    try {
      await criarFornecedor(form);
      navigate("/fornecedores");
    } catch (err) {
      setErro(err.message);
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Novo Fornecedor</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <Campo label="Razão Social" name="razaoSocial" value={form.razaoSocial} onChange={handleChange} />
        <Campo label="CNPJ" name="cnpj" value={form.cnpj} onChange={handleChange} />
        <Campo label="Contato" name="contato" value={form.contato} onChange={handleChange} />
        <div className="grid grid-cols-2 gap-4">
          <Campo label="Telefone" name="telefone" value={form.telefone} onChange={handleChange} />
          <Campo label="Email" name="email" type="email" value={form.email} onChange={handleChange} />
        </div>
        <Campo label="Endereço" name="endereco" value={form.endereco} onChange={handleChange} />

        {erro && <p className="text-sm text-red-600">{erro}</p>}

        <button
          type="submit"
          disabled={salvando}
          className="w-full bg-blue-600 text-white rounded-lg py-2 font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {salvando ? "Salvando..." : "Salvar Fornecedor"}
        </button>
      </form>
    </div>
  );
}

function Campo({ label, name, value, onChange, type = "text" }) {
  return (
    <div>
      <label className="block text-sm text-slate-600 mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required
        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

export default CadastroFornecedor;