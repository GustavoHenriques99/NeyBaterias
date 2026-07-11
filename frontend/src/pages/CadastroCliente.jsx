import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { criarClienteFisico, criarClienteJuridico } from "../services/api";

const FORM_FISICO_INICIAL = {
  cpf: "",
  nome: "",
  email: "",
  dataNascimento: "",
  telefone: "",
  cep: "",
  endereco: "",
  numero: "",
  complemento: "",
  cidade: "",
};

const FORM_JURIDICO_INICIAL = {
  cnpj: "",
  razaoSocial: "",
  nomeFantasia: "",
  ie: "",
  imTelefone: "",
  telCelular: "",
};

function CadastroCliente() {
  const [tipo, setTipo] = useState("Fisico");
  const [formFisico, setFormFisico] = useState(FORM_FISICO_INICIAL);
  const [formJuridico, setFormJuridico] = useState(FORM_JURIDICO_INICIAL);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState(null);
  const navigate = useNavigate();

  function handleChangeFisico(e) {
    const { name, value } = e.target;
    setFormFisico((atual) => ({ ...atual, [name]: value }));
  }

  function handleChangeJuridico(e) {
    const { name, value } = e.target;
    setFormJuridico((atual) => ({ ...atual, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro(null);
    setSalvando(true);

    try {
      if (tipo === "Fisico") {
        await criarClienteFisico(formFisico);
      } else {
        await criarClienteJuridico(formJuridico);
      }
      navigate("/clientes");
    } catch (err) {
      setErro(err.message);
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Novo Cliente</h1>

      {/* Seletor de tipo */}
      <div className="flex gap-2 mb-4">
        <button
          type="button"
          onClick={() => setTipo("Fisico")}
          className={`flex-1 py-2 rounded-lg text-sm font-medium ${
            tipo === "Fisico"
              ? "bg-blue-600 text-white"
              : "bg-white text-slate-600 border border-slate-300"
          }`}
        >
          Pessoa Física
        </button>
        <button
          type="button"
          onClick={() => setTipo("Juridico")}
          className={`flex-1 py-2 rounded-lg text-sm font-medium ${
            tipo === "Juridico"
              ? "bg-blue-600 text-white"
              : "bg-white text-slate-600 border border-slate-300"
          }`}
        >
          Pessoa Jurídica
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        {tipo === "Fisico" ? (
          <>
            <Campo label="Nome completo" name="nome" value={formFisico.nome} onChange={handleChangeFisico} />
            <Campo label="CPF" name="cpf" value={formFisico.cpf} onChange={handleChangeFisico} />
            <Campo label="Email" name="email" type="email" value={formFisico.email} onChange={handleChangeFisico} />
            <Campo label="Data de Nascimento" name="dataNascimento" type="date" value={formFisico.dataNascimento} onChange={handleChangeFisico} />
            <Campo label="Telefone" name="telefone" value={formFisico.telefone} onChange={handleChangeFisico} />
            <div className="grid grid-cols-2 gap-4">
              <Campo label="CEP" name="cep" value={formFisico.cep} onChange={handleChangeFisico} />
              <Campo label="Número" name="numero" value={formFisico.numero} onChange={handleChangeFisico} />
            </div>
            <Campo label="Endereço" name="endereco" value={formFisico.endereco} onChange={handleChangeFisico} />
            <div className="grid grid-cols-2 gap-4">
              <Campo label="Complemento" name="complemento" value={formFisico.complemento} onChange={handleChangeFisico} obrigatorio={false} />
              <Campo label="Cidade" name="cidade" value={formFisico.cidade} onChange={handleChangeFisico} />
            </div>
          </>
        ) : (
          <>
            <Campo label="Razão Social" name="razaoSocial" value={formJuridico.razaoSocial} onChange={handleChangeJuridico} />
            <Campo label="Nome Fantasia" name="nomeFantasia" value={formJuridico.nomeFantasia} onChange={handleChangeJuridico} />
            <Campo label="CNPJ" name="cnpj" value={formJuridico.cnpj} onChange={handleChangeJuridico} />
            <Campo label="Inscrição Estadual" name="ie" value={formJuridico.ie} onChange={handleChangeJuridico} obrigatorio={false} />
            <div className="grid grid-cols-2 gap-4">
              <Campo label="Telefone Fixo" name="imTelefone" value={formJuridico.imTelefone} onChange={handleChangeJuridico} obrigatorio={false} />
              <Campo label="Celular" name="telCelular" value={formJuridico.telCelular} onChange={handleChangeJuridico} />
            </div>
          </>
        )}

        {erro && <p className="text-sm text-red-600">{erro}</p>}

        <button
          type="submit"
          disabled={salvando}
          className="w-full bg-blue-600 text-white rounded-lg py-2 font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {salvando ? "Salvando..." : "Salvar Cliente"}
        </button>
      </form>
    </div>
  );
}

function Campo({ label, name, value, onChange, type = "text", obrigatorio = true }) {
  return (
    <div>
      <label className="block text-sm text-slate-600 mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={obrigatorio}
        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

export default CadastroCliente;