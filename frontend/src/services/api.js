const API_BASE_URL = "http://localhost:5001/api";

async function get(endpoint) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`);
  if (!response.ok) {
    throw new Error(`Erro ao buscar ${endpoint}`);
  }
  return response.json();
}


async function post(endpoint, dados) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  });

  if (!response.ok) {
    const erro = await response.json().catch(() => null);
    throw new Error(erro?.erro || erro?.title || `Erro ao salvar em ${endpoint}`);
  }

  return response.json();
}


export function getProdutos() {
  return get("/produtos");
}

export function getVendas() {
  return get("/vendas");
}

export function getSaldoEstoque() {
  return get("/estoque/saldo");
}

export function criarProduto(dados) {
  return post("/produtos", dados);
}


//Funçoes do cliente
export function getClientes() {
  return get("/clientes");
}

export function criarClienteFisico(dados) {
  return post("/clientes/fisico", dados);
}

export function criarClienteJuridico(dados) {
  return post("/clientes/juridico", dados);
}