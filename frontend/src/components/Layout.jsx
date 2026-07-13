import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Boxes,
  ShoppingCart,
  Users,
  Truck,
  Settings,
  Wrench,
  PackagePlus,
  LogOut,
} from "lucide-react";
import { getUsuarioLogado, logout } from "../services/api";

const menuItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/produtos", label: "Produtos", icon: Package },
  { to: "/servicos", label: "Serviços", icon: Wrench },
  { to: "/estoque", label: "Estoque", icon: Boxes },
  { to: "/vendas", label: "Vendas", icon: ShoppingCart },
  { to: "/clientes", label: "Clientes", icon: Users },
  { to: "/fornecedores", label: "Fornecedores", icon: Truck },
  { to: "/reposicoes", label: "Reposições", icon: PackagePlus },
  { to: "/configuracoes", label: "Configurações", icon: Settings },
];

function Layout() {
  const usuario = getUsuarioLogado();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Menu lateral fixo */}
      <aside className="w-64 bg-slate-900 text-slate-200 flex flex-col">
        <div className="px-6 py-5 text-lg font-bold text-white border-b border-slate-800">
          NeyBaterias
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {menuItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:bg-slate-800"
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        {usuario && (
          <div className="px-3 py-4 border-t border-slate-800">
            <div className="px-3 mb-2">
              <p className="text-sm font-medium text-white">{usuario.nome}</p>
              <p className="text-xs text-slate-400">{usuario.cargo}</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-800"
            >
              <LogOut size={18} />
              Sair
            </button>
          </div>
        )}
      </aside>

      {/* Conteúdo da página atual */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;