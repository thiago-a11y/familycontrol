import { useState, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";

interface Transacao {
  id: string;
  nome: string;
  valor: number;
  recorrente: boolean;
  frequencia: string;
  dataInicio: Date;
  dataFim: Date;
  categoria: string;
}

interface Meta {
  id: string;
  nome: string;
  valorAlvo: number;
  prazo: Date;
  contribuicaoMensal: number;
}

interface Membro {
  id: string;
  nome: string;
  avatar: string;
  cor: string;
}

const categoriasIniciais = [
  { id: "1", nome: "Moradia" },
  { id: "2", nome: "Alimentação" },
  { id: "3", nome: "Transporte" },
  { id: "4", nome: "Saúde" },
  { id: "5", nome: "Lazer" },
  { id: "6", nome: "Educação" },
];

const metasIniciais = [
  { id: "1", nome: "Poupança", valorAlvo: 1000, prazo: new Date("2024-12-31"), contribuicaoMensal: 50 },
  { id: "2", nome: "Viagem", valorAlvo: 2000, prazo: new Date("2025-06-30"), contribuicaoMensal: 100 },
  { id: "3", nome: "Reforma", valorAlvo: 5000, prazo: new Date("2026-12-31"), contribuicaoMensal: 200 },
];

const membrosIniciais = [
  { id: "1", nome: "Pai", avatar: "https://via.placeholder.com/50", cor: "blue" },
  { id: "2", nome: "Mãe", avatar: "https://via.placeholder.com/50", cor: "pink" },
  { id: "3", nome: "Filho", avatar: "https://via.placeholder.com/50", cor: "green" },
];

export default function App() {
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [metas, setMetas] = useState<Meta[]>(metasIniciais);
  const [membros, setMembros] = useState<Membro[]>(membrosIniciais);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<string>("");
  const [membroSelecionado, setMembroSelecionado] = useState<string>("");
  const [valor, setValor] = useState<number>(0);
  const [nome, setNome] = useState<string>("");
  const [recorrente, setRecorrente] = useState<boolean>(false);
  const [frequencia, setFrequencia] = useState<string>("");
  const [dataInicio, setDataInicio] = useState<Date>(new Date());
  const [dataFim, setDataFim] = useState<Date>(new Date());

  const adicionarTransacao = useCallback(() => {
    const novaTransacao: Transacao = {
      id: uuidv4(),
      nome,
      valor,
      recorrente,
      frequencia,
      dataInicio,
      dataFim,
      categoria: categoriaSelecionada,
    };
    setTransacoes([...transacoes, novaTransacao]);
    setNome("");
    setValor(0);
    setRecorrente(false);
    setFrequencia("");
    setDataInicio(new Date());
    setDataFim(new Date());
  }, [nome, valor, recorrente, frequencia, dataInicio, dataFim, categoriaSelecionada, transacoes]);

  const adicionarMeta = useCallback(() => {
    const novaMeta: Meta = {
      id: uuidv4(),
      nome: "Nova Meta",
      valorAlvo: 0,
      prazo: new Date(),
      contribuicaoMensal: 0,
    };
    setMetas([...metas, novaMeta]);
  }, [metas]);

  con