import { useState } from "react";
import AbaOperadores from "../components/configuracoes/AbaOperadores";
import AbaFormasPagamento from "../components/configuracoes/AbaFormasPagamento";
import AbaMeuPerfil from "../components/configuracoes/AbaMeuPerfil";
import AbaEmpresa from "../components/configuracoes/AbaEmpresa";
import { ehAdministrador } from "../services/api";

function Configuracoes() {
  const administrador = ehAdministrador();

  // Operadores e Empresa mexem com dados sensíveis (senhas, dados legais da
  // empresa) — só aparecem pra quem tem nível 4 (o backend também já bloqueia
  // isso independente do que aparece aqui, essa é só a parte visual).
  const abas = [
    ...(administrador ? [{ id: "operadores", label: "Operadores" }] : []),
    { id: "pagamento", label: "Formas de Pagamento" },
    { id: "perfil", label: "Meu Perfil" },
    ...(administrador ? [{ id: "empresa", label: "Empresa" }] : []),
  ];

  const [abaAtiva, setAbaAtiva] = useState(administrador ? "operadores" : "pagamento");

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Configurações</h1>

      {/* Seletor de abas */}
      <div className="flex gap-1 border-b border-slate-200 mb-6 overflow-x-auto">
        {abas.map((aba) => (
          <button
            key={aba.id}
            onClick={() => setAbaAtiva(aba.id)}
            className={`px-4 py-2 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
              abaAtiva === aba.id
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            {aba.label}
          </button>
        ))}
      </div>

      {/* Conteúdo da aba selecionada */}
      {abaAtiva === "operadores" && administrador && <AbaOperadores />}
      {abaAtiva === "pagamento" && <AbaFormasPagamento />}
      {abaAtiva === "perfil" && <AbaMeuPerfil />}
      {abaAtiva === "empresa" && administrador && <AbaEmpresa />}
    </div>
  );
}

export default Configuracoes;