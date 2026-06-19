import React from 'react';

// Rendu visuel de la slide (Comparatif / Pros & Cons)
export const ComparatifVisual = ({ content }) => {
  const colG = content?.colGauche || { titre: 'Avantages', items: ['Point positif 1', 'Point positif 2'] };
  const colD = content?.colDroite || { titre: 'Inconvénients', items: ['Point négatif 1', 'Point négatif 2'] };

  return (
    <div className="w-[850px] aspect-video bg-gray-900 rounded-2xl border-2 border-gray-700 shadow-2xl flex flex-col p-10 relative overflow-hidden flex-shrink-0">
      {/* Titre de la slide */}
      <h3 className="text-4xl font-extrabold text-white text-center mb-8 tracking-tight break-words max-w-full">
        {content?.titre || 'Analyse Comparative'}
      </h3>

      <div className="flex-1 flex gap-8">
        {/* Colonne Gauche (Positif) */}
        <div className="flex-1 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-6 flex flex-col">
          <h4 className="text-emerald-400 font-bold text-xl mb-4 flex items-center gap-2 border-b border-emerald-500/20 pb-2">
            <span className="w-6 h-6 bg-emerald-500 text-gray-900 rounded-full flex items-center justify-center text-xs">✓</span>
            {colG.titre}
          </h4>
          <ul className="space-y-3">
            {colG.items.map((item, i) => (
              <li key={i} className="text-gray-200 text-sm flex items-start gap-3">
                <span className="text-emerald-500 mt-1">•</span>
                <span className="break-words">{item || '...'}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Colonne Droite (Négatif) */}
        <div className="flex-1 bg-rose-500/5 border border-rose-500/20 rounded-2xl p-6 flex flex-col">
          <h4 className="text-rose-400 font-bold text-xl mb-4 flex items-center gap-2 border-b border-rose-500/20 pb-2">
            <span className="w-6 h-6 bg-rose-500 text-gray-900 rounded-full flex items-center justify-center text-xs font-black">✕</span>
            {colD.titre}
          </h4>
          <ul className="space-y-3">
            {colD.items.map((item, i) => (
              <li key={i} className="text-gray-200 text-sm flex items-start gap-3">
                <span className="text-rose-500 mt-1">•</span>
                <span className="break-words">{item || '...'}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <span className="absolute bottom-4 right-5 text-[10px] text-gray-600 font-mono tracking-widest select-none bg-gray-900/50 px-2 py-0.5 rounded">
        16:9
      </span>
    </div>
  );
};

// Formulaire d'édition pour le comparatif
export const ComparatifForm = ({ content, onChange }) => {
  const colG = content?.colGauche || { titre: 'Avantages', items: [''] };
  const colD = content?.colDroite || { titre: 'Inconvénients', items: [''] };

  // Mise à jour générique pour une colonne spécifique
  const updateColumn = (side, field, value) => {
    const key = side === 'gauche' ? 'colGauche' : 'colDroite';
    const currentData = side === 'gauche' ? colG : colD;
    onChange(key, { ...currentData, [field]: value });
  };

  // Mise à jour d'un item précis dans une liste
  const updateItem = (side, index, value) => {
    const currentData = side === 'gauche' ? colG : colD;
    const newItems = [...currentData.items];
    newItems[index] = value;
    updateColumn(side, 'items', newItems);
  };

  // Ajout/Suppression d'items (limité à 6 pour le design)
  const addItem = (side) => {
    const currentData = side === 'gauche' ? colG : colD;
    if (currentData.items.length < 6) {
      updateColumn(side, 'items', [...currentData.items, '']);
    }
  };

  const removeItem = (side, index) => {
    const currentData = side === 'gauche' ? colG : colD;
    if (currentData.items.length > 1) {
      const newItems = currentData.items.filter((_, i) => i !== index);
      updateColumn(side, 'items', newItems);
    }
  };

  return (
    <div className="space-y-6">
      {/* Titre Principal */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Titre de la slide</label>
        <input
          type="text"
          value={content?.titre || ''}
          onChange={(e) => onChange('titre', e.target.value)}
          placeholder="Ex: Analyse de la Solution A"
          className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg p-3 focus:outline-none focus:border-blue-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Édition Colonne Gauche */}
        <div className="space-y-4 bg-emerald-950/20 p-4 rounded-xl border border-emerald-900/30">
          <input
            type="text"
            value={colG.titre}
            onChange={(e) => updateColumn('gauche', 'titre', e.target.value)}
            className="w-full bg-emerald-900/40 border border-emerald-800/50 text-emerald-400 font-bold rounded-lg p-2 focus:outline-none"
            placeholder="Titre Gauche"
          />
          <div className="space-y-2">
            {colG.items.map((item, i) => (
              <div key={i} className="flex gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => updateItem('gauche', i, e.target.value)}
                  className="flex-1 bg-gray-800 border border-gray-700 text-white text-xs rounded p-2"
                  placeholder="Argument..."
                />
                <button onClick={() => removeItem('gauche', i)} className="text-gray-500 hover:text-rose-500 px-1">✕</button>
              </div>
            ))}
          </div>
          <button 
            onClick={() => addItem('gauche')}
            className="w-full py-1.5 border border-dashed border-emerald-800/50 text-emerald-600 hover:text-emerald-400 text-xs rounded transition"
          >
            + Ajouter un point
          </button>
        </div>

        {/* Édition Colonne Droite */}
        <div className="space-y-4 bg-rose-950/20 p-4 rounded-xl border border-rose-900/30">
          <input
            type="text"
            value={colD.titre}
            onChange={(e) => updateColumn('droite', 'titre', e.target.value)}
            className="w-full bg-rose-900/40 border border-rose-800/50 text-rose-400 font-bold rounded-lg p-2 focus:outline-none"
            placeholder="Titre Droite"
          />
          <div className="space-y-2">
            {colD.items.map((item, i) => (
              <div key={i} className="flex gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => updateItem('droite', i, e.target.value)}
                  className="flex-1 bg-gray-800 border border-gray-700 text-white text-xs rounded p-2"
                  placeholder="Argument..."
                />
                <button onClick={() => removeItem('droite', i)} className="text-gray-500 hover:text-rose-500 px-1">✕</button>
              </div>
            ))}
          </div>
          <button 
            onClick={() => addItem('droite')}
            className="w-full py-1.5 border border-dashed border-rose-800/50 text-rose-600 hover:text-rose-400 text-xs rounded transition"
          >
            + Ajouter un point
          </button>
        </div>
      </div>
    </div>
  );
};