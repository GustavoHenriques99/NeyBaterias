function CardResumo({ titulo, valor, subtitulo, icone: Icone, cor }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4">
      <div className={`p-3 rounded-lg ${cor}`}>
        <Icone size={24} className="text-white" />
      </div>
      <div>
        <p className="text-sm text-slate-500">{titulo}</p>
        <p className="text-2xl font-bold text-slate-800">{valor}</p>
        {subtitulo && <p className="text-xs text-slate-400">{subtitulo}</p>}
      </div>
    </div>
  );
}

export default CardResumo;