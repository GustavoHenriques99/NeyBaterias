import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getClientes, atualizarClienteFisico, atualizarClienteJuridico } from "../services/api";

function EditarCliente() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tipo, setTipo] = useState("Fisico");
  const [formFisico, setFormFisico] = useState(null);
  const [formJuridico, setFormJuridico] = useState(null);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    getClientes()
      .then((lista) => {
        const c = lista.find((x) => x.idCliente === Number(id));
        if (!c) throw new Error("Cliente não encontrado.");
        setTipo(c.tipo);
        if (c.tipo === "Fisico") {
          setFormFisico({
            cpf: c.cpf ?? "",
            nome: c.nome ?? "",
            email: c.email ?? "",
            dataNascimento: c.dataNascimento?.split("T")[0] ?? "",
            telefone: c.telefone ?? "",
            cep: c.cep ?? "",
            endereco: c.endereco ?? "",
            numero: c.numero ?? "",
            complemento: c.complemento ?? "",
            cidade: c.cidade ?? "",
          });
        } else {
          setFormJuridico({
            cnpj: c.cnpj ?? "",
            razaoSocial: c.razaoSocial ?? "",
            nomeFantasia: c.nomeFantasia ?? "",
            ie: c.ie ?? "",
            imTelefone: c.imTelefone ?? "",
            telCelular: c.telCelular ?? "",
          });
        }
      })
      .catch((err) => setErro(err.message));
  }, [id]);

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
        await atualizarClienteFisico(Number(id), {
          ...formFisico,
          dataNascimento: formFisico.dataNascimento || null,
        });
      } else {
        await atualizarClienteJuridico(Number(id), formJuridico);
      }
      navigate("/clientes");
    } catch (err) {
      setErro(err.message);
    } finally {
      setSalvando(false);
    }
  }

  const carregando = tipo === "Fisico" ? !formFisico : !formJuridico;
  if (carregando && !erro) return <p className="p-4">Carregando...</p>;
  if (erro) return <p className="p-4 text-red-600">Erro: {erro}</p>;

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Editar Cliente</h1>

      <div className="flex gap-2 mb-4">
        <div className={`flex-1 py-2 rounded-lg text-sm font-medium text-center ${tipo === "Fisico" ? "bg-blue-600 text-white" : "bg-white text-slate-600 border border-slate-300"}`}>
          Pessoa Física
        </div>
        <div className={`flex-1 py-2 rounded-lg text-sm font-medium text-center ${tipo === "Juridico" ? "bg-blue-600 text-white" : "bg-white text-slate-600 border border-slate-300"}`}>
          Pessoa Jurídica
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        {tipo === "Fisico" && formFisico ? (
          <>
            <Campo label="Nome completo" name="nome" value={formFisico.nome} onChange={handleChangeFisico} />
            <Campo label="CPF" name="cpf" value={formFisico.cpf} onChange={handleChangeFisico} obrigatorio={false} />
            <Campo label="Email" name="email" type="email" value={formFisico.email} onChange={handleChangeFisico} obrigatorio={false} />
            <Campo label="Data de Nascimento" name="dataNascimento" type="date" value={formFisico.dataNascimento} onChange={handleChangeFisico} obrigatorio={false} />
            <Campo label="Telefone" name="telefone" value={formFisico.telefone} onChange={handleChangeFisico} obrigatorio={false} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Campo label="CEP" name="cep" value={formFisico.cep} onChange={handleChangeFisico} obrigatorio={false} />
              <Campo label="Número" name="numero" value={formFisico.numero} onChange={handleChangeFisico} />
            </div>
            <Campo label="Endereço" name="endereco" value={formFisico.endereco} onChange={handleChangeFisico} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Campo label="Complemento" name="complemento" value={formFisico.complemento} onChange={handleChangeFisico} obrigatorio={false} />
              <Campo label="Cidade" name="cidade" value={formFisico.cidade} onChange={handleChangeFisico} />
            </div>
          </>
        ) : formJuridico ? (
          <>
            <Campo label="Razão Social" name="razaoSocial" value={formJuridico.razaoSocial} onChange={handleChangeJuridico} />
            <Campo label="Nome Fantasia" name="nomeFantasia" value={formJuridico.nomeFantasia} onChange={handleChangeJuridico} obrigatorio={false} />
            <Campo label="CNPJ" name="cnpj" value={formJuridico.cnpj} onChange={handleChangeJuridico} obrigatorio={false} />
            <Campo label="Inscrição Estadual" name="ie" value={formJuridico.ie} onChange={handleChangeJuridico} obrigatorio={false} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Campo label="Telefone Fixo" name="imTelefone" value={formJuridico.imTelefone} onChange={handleChangeJuridico} obrigatorio={false} />
              <Campo label="Celular" name="telCelular" value={formJuridico.telCelular} onChange={handleChangeJuridico} obrigatorio={false} />
            </div>
          </>
        ) : null}

        {erro && <p className="text-sm text-red-600">{erro}</p>}

        <div className="flex gap-3">
          <button type="button" onClick={() => navigate("/clientes")}
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

function Campo({ label, name, value, onChange, type = "text", obrigatorio = true }) {
  return (
    <div>
      <label className="block text-sm text-slate-600 mb-1">{label}</label>
      <input type={type} name={name} value={value} onChange={onChange} required={obrigatorio}
        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
    </div>
  );
}

export default EditarCliente;