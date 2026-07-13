import { useMemo, useState } from "react";

const ITENS_POR_PAGINA = 100;

/**
 * Hook reutilizável para listas: busca por texto, ordenação alfabética
 * (crescente/decrescente) e paginação de 100 em 100 itens.
 *
 * @param {Array} itens - lista completa vinda da API
 * @param {(item: any) => string} obterCampoOrdenacao - função que extrai o
 *   texto usado tanto pra busca quanto pra ordenação (ex: i => i.descricao)
 */
export function useFiltroLista(itens, obterCampoOrdenacao) {
  const [busca, setBuscaInterna] = useState("");
  const [ordem, setOrdem] = useState("asc"); // "asc" | "desc"
  const [pagina, setPaginaInterna] = useState(1);

  const filtradosEOrdenados = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    let resultado = itens;
    if (termo) {
      resultado = resultado.filter((item) =>
        obterCampoOrdenacao(item).toLowerCase().includes(termo)
      );
    }

    return [...resultado].sort((a, b) => {
      const campoA = obterCampoOrdenacao(a).toLowerCase();
      const campoB = obterCampoOrdenacao(b).toLowerCase();
      if (campoA < campoB) return ordem === "asc" ? -1 : 1;
      if (campoA > campoB) return ordem === "asc" ? 1 : -1;
      return 0;
    });
  }, [itens, busca, ordem, obterCampoOrdenacao]);

  const totalPaginas = Math.max(
    1,
    Math.ceil(filtradosEOrdenados.length / ITENS_POR_PAGINA)
  );
  const paginaAtual = Math.min(pagina, totalPaginas);

  const itensPaginados = useMemo(() => {
    const inicio = (paginaAtual - 1) * ITENS_POR_PAGINA;
    return filtradosEOrdenados.slice(inicio, inicio + ITENS_POR_PAGINA);
  }, [filtradosEOrdenados, paginaAtual]);

  function setBusca(valor) {
    setBuscaInterna(valor);
    setPaginaInterna(1);
  }

  function alternarOrdem() {
    setOrdem((atual) => (atual === "asc" ? "desc" : "asc"));
    setPaginaInterna(1);
  }

  return {
    busca,
    setBusca,
    ordem,
    alternarOrdem,
    pagina: paginaAtual,
    setPagina: setPaginaInterna,
    totalPaginas,
    itensPaginados,
    totalFiltrados: filtradosEOrdenados.length,
    itensPorPagina: ITENS_POR_PAGINA,
  };
}