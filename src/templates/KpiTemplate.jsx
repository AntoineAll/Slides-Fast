import React from 'react';

// Rendu visuel de la slide (KPI / Indicateur)
export const KpiVisual = ({ content }) => {
  return (
    <div className="w-[850px] h-[478px] bg-[#0f172a] rounded-2xl border border-gray-800 shadow-2xl flex p-16 flex-shrink-0 box-border overflow-hidden">
      {/* Colonne Gauche : Chiffre principal */}
      <div className="w-1/2 flex flex-col justify-center border-r border-gray-800 pr-12">
        <h3 className="text-blue-500 font-bold uppercase tracking-[0.2em] text-[10px] mb-4">
          Indicateur Clé
        </h3>
        <div className="text-7xl font-extrabold text-white mb-3 tracking-tight">
          {content?.chiffre || '0%'}
        </div>
        <p className="text-gray-400 text-lg font-medium">
          {content?.label || 'Titre de l\'indicateur'}
        </p>
      </div>

      {/* Colonne Droite : Détails */}
      <div className="w-1/2 pl-12 flex flex-col justify-center">
        <h4 className="text-white font-semibold mb-8 text-sm uppercase tracking-wider text-gray-400">
          Détails de performance
        </h4>
        <div className="space-y-6">
          {(content?.points?.filter(p => p.trim() !== '') || ['Exemple de point']).map((point, i) => (
            <div key={i} className="flex items-center gap-4 group">
              <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
              <p className="text-gray-300 text-base font-light tracking-wide group-hover:text-white transition-colors">
                {point}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Formulaire d'édition
export const KpiForm = ({ content, onChange }) => {
  const updatePoints = (index, value) => {
    const newPoints = [...(content?.points || ['', '', '', ''])];
    newPoints[index] = value;
    onChange('points', newPoints);
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Chiffre / Indicateur</label>
        <input
          type="text"
          value={content?.chiffre || ''}
          onChange={(e) => onChange('chiffre', e.target.value)}
          placeholder="Ex: 85%"
          className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg p-3"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Label du chiffre</label>
        <input
          type="text"
          value={content?.label || ''}
          onChange={(e) => onChange('label', e.target.value)}
          placeholder="Ex: Croissance annuelle"
          className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg p-3"
        />
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">Points de contexte</label>
        {[0, 1, 2, 3].map((i) => (
          <input
            key={i}
            type="text"
            value={content?.points?.[i] || ''}
            onChange={(e) => updatePoints(i, e.target.value)}
            placeholder={`Point ${i + 1}`}
            className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg p-2 text-sm"
          />
        ))}
      </div>

      {/* Notes du présentateur */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Notes du présentateur</label>
        <textarea
          value={content?.notes || ''}
          onChange={(e) => onChange('notes', e.target.value)}
          placeholder="Ajoutez vos points de discours ici..."
          rows={3}
          className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg p-3"
        />
      </div>
    </div>
  );
};

// Composant de notes pour le PresenterMode
export const KpiNotes = ({ content }) => (
  <div className="space-y-4">
    <h3 className="text-lg font-bold text-blue-400">Notes</h3>
    <div className="p-3 bg-gray-800 rounded border border-gray-700 min-h-[100px]">
      <p className="text-gray-300 text-sm whitespace-pre-line">
        {content?.notes || "Aucune note spécifique ajoutée pour cette slide."}
      </p>
    </div>
  </div>
);