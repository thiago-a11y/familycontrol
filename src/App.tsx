import { useState } from "react"

interface Transacao {
  id: number
  tipo: "receita" | "despesa"
  nome: string
  valor: number
  categoria: string
  membro: string
  data: string
}

const CATEGORIAS = ["Moradia", "Alimentacao", "Transporte", "Saude", "Lazer", "Educacao", "Outros"]
const MEMBROS = ["Pai", "Mae", "Filho", "Filha"]

let nextId = 5
const SEED: Transacao[] = [
  { id: 1, tipo: "receita", nome: "Salario Pai", valor: 6000, categoria: "Outros", membro: "Pai", data: "2026-04-01" },
  { id: 2, tipo: "receita", nome: "Salario Mae", valor: 4000, categoria: "Outros", membro: "Mae", data: "2026-04-01" },
  { id: 3, tipo: "despesa", nome: "Aluguel", valor: 2200, categoria: "Moradia", membro: "Pai", data: "2026-04-05" },
  { id: 4, tipo: "despesa", nome: "Supermercado", valor: 950, categoria: "Alimentacao", membro: "Mae", data: "2026-04-03" },
]

export default function App() {
  const [transacoes, setTransacoes] = useState<Transacao[]>(SEED)
  const [tela, setTela] = useState<"dash" | "add" | "metas">("dash")
  const [form, setForm] = useState({ tipo: "despesa" as "receita"|"despesa", nome: "", valor: "", categoria: "Outros", membro: "Pai" })
  const [filtro, setFiltro] = useState("")

  const rec = transacoes.filter(t => t.tipo === "receita").reduce((s, t) => s + t.valor, 0)
  const desp = transacoes.filter(t => t.tipo === "despesa").reduce((s, t) => s + t.valor, 0)
  const saldo = rec - desp
  const fmt = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

  const porCat = CATEGORIAS.map(c => ({
    cat: c, total: transacoes.filter(t => t.tipo === "despesa" && t.categoria === c).reduce((s, t) => s + t.valor, 0)
  })).filter(c => c.total > 0).sort((a, b) => b.total - a.total)

  const adicionar = () => {
    if (!form.nome || !form.valor) return
    setTransacoes(p => [...p, { id: nextId++, tipo: form.tipo, nome: form.nome, valor: parseFloat(form.valor)||0, categoria: form.categoria, membro: form.membro, data: new Date().toISOString().split("T")[0] }])
    setForm({ tipo: "despesa", nome: "", valor: "", categoria: "Outros", membro: "Pai" })
    setTela("dash")
  }

  const metas = [
    { nome: "Fundo Emergencia", alvo: 20000, atual: 8500 },
    { nome: "Viagem Familia", alvo: 15000, atual: 4200 },
    { nome: "Carro Novo", alvo: 60000, atual: 12000 },
  ]

  const lista = filtro ? transacoes.filter(t => t.nome.toLowerCase().includes(filtro.toLowerCase())) : transacoes

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <header className="bg-gray-900/80 backdrop-blur-xl border-b border-gray-800 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <h1 className="text-lg font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Controle Familiar</h1>
        <div className="flex gap-1">
          {(["dash","metas"] as const).map(t => (
            <button key={t} onClick={() => setTela(t)} className={`px-3 py-1 rounded-lg text-xs font-medium ${tela===t?"bg-emerald-500/20 text-emerald-400":"text-gray-500"}`}>
              {t==="dash"?"Inicio":"Metas"}
            </button>
          ))}
        </div>
      </header>

      <div className="max-w-lg mx-auto p-4 space-y-4">
        {tela === "dash" && (<>
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-gray-900 rounded-2xl p-3 border border-gray-800">
              <div className="text-[10px] text-gray-500">Saldo</div>
              <div className={`text-lg font-bold ${saldo>=0?"text-emerald-400":"text-red-400"}`}>{fmt(saldo)}</div>
            </div>
            <div className="bg-gray-900 rounded-2xl p-3 border border-gray-800">
              <div className="text-[10px] text-gray-500">Receitas</div>
              <div className="text-lg font-bold text-emerald-400">{fmt(rec)}</div>
            </div>
            <div className="bg-gray-900 rounded-2xl p-3 border border-gray-800">
              <div className="text-[10px] text-gray-500">Despesas</div>
              <div className="text-lg font-bold text-red-400">{fmt(desp)}</div>
            </div>
          </div>

          {porCat.length > 0 && (
            <div className="bg-gray-900 rounded-2xl p-4 border border-gray-800">
              <div className="text-xs font-bold text-gray-400 mb-3">Por Categoria</div>
              {porCat.map(c => (
                <div key={c.cat} className="flex items-center gap-2 mb-2">
                  <span className="text-[11px] text-gray-400 w-24 truncate">{c.cat}</span>
                  <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full" style={{width:`${Math.min(100,(c.total/desp)*100)}%`}}/>
                  </div>
                  <span className="text-[11px] font-bold text-gray-300 w-20 text-right">{fmt(c.total)}</span>
                </div>
              ))}
            </div>
          )}

          <input type="text" placeholder="Buscar..." value={filtro} onChange={e=>setFiltro(e.target.value)}
            className="w-full px-4 py-2 rounded-xl text-sm bg-gray-900 border border-gray-800 text-gray-200 placeholder-gray-600 focus:border-emerald-500 focus:outline-none"/>

          <div className="space-y-2">
            {lista.slice().reverse().map(t => (
              <div key={t.id} className="bg-gray-900 rounded-xl p-3 border border-gray-800 flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${t.tipo==="receita"?"bg-emerald-500/15 text-emerald-400":"bg-red-500/15 text-red-400"}`}>
                  {t.tipo==="receita"?"+":"-"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-200 truncate">{t.nome}</div>
                  <div className="text-[10px] text-gray-500">{t.categoria} - {t.membro}</div>
                </div>
                <div className={`text-sm font-bold ${t.tipo==="receita"?"text-emerald-400":"text-red-400"}`}>
                  {t.tipo==="receita"?"+":"-"}{fmt(t.valor)}
                </div>
                <button onClick={()=>setTransacoes(p=>p.filter(x=>x.id!==t.id))} className="text-gray-600 hover:text-red-400 text-xs">x</button>
              </div>
            ))}
          </div>

          <button onClick={()=>setTela("add")} className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white text-2xl font-bold shadow-lg shadow-emerald-500/30 hover:scale-110 transition-all z-20">+</button>
        </>)}

        {tela === "add" && (
          <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800 space-y-4">
            <div className="flex justify-between"><h2 className="text-sm font-bold">Nova Transacao</h2><button onClick={()=>setTela("dash")} className="text-gray-500">x</button></div>
            <div className="flex gap-2">
              {(["despesa","receita"] as const).map(t=>(
                <button key={t} onClick={()=>setForm(f=>({...f,tipo:t}))} className={`flex-1 py-2 rounded-xl text-xs font-bold ${form.tipo===t?(t==="receita"?"bg-emerald-500/20 text-emerald-400":"bg-red-500/20 text-red-400"):"bg-gray-800 text-gray-500"}`}>{t==="receita"?"Receita":"Despesa"}</button>
              ))}
            </div>
            <input placeholder="Nome" value={form.nome} onChange={e=>setForm(f=>({...f,nome:e.target.value}))} className="w-full px-4 py-2.5 rounded-xl text-sm bg-gray-800 border border-gray-700 text-gray-200 focus:border-emerald-500 focus:outline-none"/>
            <input type="number" placeholder="Valor" value={form.valor} onChange={e=>setForm(f=>({...f,valor:e.target.value}))} className="w-full px-4 py-2.5 rounded-xl text-sm bg-gray-800 border border-gray-700 text-gray-200 focus:border-emerald-500 focus:outline-none"/>
            <select value={form.categoria} onChange={e=>setForm(f=>({...f,categoria:e.target.value}))} className="w-full px-4 py-2.5 rounded-xl text-sm bg-gray-800 border border-gray-700 text-gray-200">{CATEGORIAS.map(c=><option key={c}>{c}</option>)}</select>
            <select value={form.membro} onChange={e=>setForm(f=>({...f,membro:e.target.value}))} className="w-full px-4 py-2.5 rounded-xl text-sm bg-gray-800 border border-gray-700 text-gray-200">{MEMBROS.map(m=><option key={m}>{m}</option>)}</select>
            <button onClick={adicionar} className="w-full py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-emerald-500 to-cyan-500 text-white">Adicionar</button>
          </div>
        )}

        {tela === "metas" && (
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-gray-300">Metas Financeiras</h2>
            {metas.map(m => {
              const pct = Math.round((m.atual/m.alvo)*100)
              return (
                <div key={m.nome} className="bg-gray-900 rounded-2xl p-4 border border-gray-800">
                  <div className="flex justify-between mb-2"><span className="text-sm font-medium">{m.nome}</span><span className="text-xs font-bold text-emerald-400">{pct}%</span></div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden mb-2"><div className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full" style={{width:`${pct}%`}}/></div>
                  <div className="flex justify-between text-[10px] text-gray-500"><span>{fmt(m.atual)} de {fmt(m.alvo)}</span><span>Falta: {fmt(m.alvo-m.atual)}</span></div>
                </div>
              )
            })}
          </div>
        )}
        <p className="text-center text-[10px] text-gray-700 mt-6 pb-20">Controle Familiar - Synerium Factory</p>
      </div>
    </div>
  )
}
