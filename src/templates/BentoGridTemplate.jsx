import React from 'react';

// Rendu visuel de la slide (Style Bento Grid)
export const BentoGridVisual = ({ content }) => {
  const cards = content?.cards || [
    { titre: 'Performance', description: 'Optimisé pour une vitesse et une réactivité maximale sur tous les supports.', tag: '01' },
    { titre: 'Sécurité', description: 'Chiffrement de bout en bout et protection avancée de vos données.', tag: '02' },
    { titre: 'Évolutivité', description: 'Architecture conçue pour grandir au rythme de vos ambitions.', tag: '03' },
  ];

  return (
    <div className="w-[850px] aspect-video bg-slate-950 rounded-2xl border border-slate-800 shadow-2xl flex flex-col p-8 relative overflow-hidden flex-shrink-0">
      {/* Effet lumineux de fond subtil */}
      <div className="absolute -top-32 -left-32 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* En-tête de la slide */}
      <div className="mb-6 z-10">
        <span className="text-cyan-400 font-mono text-xs uppercase tracking-widest bg-cyan-950/60 border border-cyan-800/50 px-3 py-1 rounded-full">
          {content?.badge || 'Aperçu global'}
        </span>
        <h3 className="text-2xl font-black text-white mt-2 tracking-tight">
          {content?.titre || 'Titre principal de la slide'}
        </h3>
      </div>

      {/* Grille Bento */}
      <div className="grid grid-cols-3 gap-4 flex-1 z-10 items-stretch">
        {cards.map((card, index) => (
          <div 
            key={index} 
            className="bg-slate-900/50 hover:bg-slate-900/80 transition-all duration-300 border border-slate-800/80 hover:border-slate-700 rounded-xl p-5 flex flex-col justify-between relative group shadow-lg"
          >
            {/* Liseré lumineux au survol */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-950/60 border border-indigo-800/40 px-2 py-0.5 rounded">
                  {card.tag || `0${index + 1}`}
                </span>
              </div>
              <h4 className="text-white font-bold text-base mb-2 tracking-wide group-hover:text-cyan-300 transition-colors">
                {card.titre || 'Titre de la carte'}
              </h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                {card.description || 'Description courte du point clé...'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Formulaire d'édition pour la Bento Grid
export const BentoGridForm = ({ content, onChange }) => {
  const cards = content?.cards || [
    { titre: '', description: '', tag: '01' }
  ];

  const handleMainTitleChange = (val) => {
    onChange('titre', val);
  };

  const handleBadgeChange = (val) => {
    onChange('badge', val);
  };

  const handleCardChange = (index, field, val) => {
    const updatedCards = [...cards];
    updatedCards[index] = { ...updatedCards[index], [field]: val };
    onChange('cards', updatedCards);
  };

  const addCard = () => {
    if (cards.length < 3) {
      onChange('cards', [...cards, { titre: '', description: '', tag: `0${cards.length + 1}` }]);
    }
  };

  const removeCard = (index) => {
    if (cards.length > 1) {
      const updatedCards = cards.filter((_, i) => i !== index);
      onChange('cards', updatedCards);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Badge / Catégorie</label>
          <input
            type="text"
            value={content?.badge || ''}
            onChange={(e) => handleBadgeChange(e.target.value)}
            placeholder="Ex: INNOVATION"
            className="w-full bg-slate-900 border border-slate-700 text-white text-xs rounded-lg p-2.5 focus:outline-none focus:border-cyan-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Titre principal</label>
          <input
            type="text"
            value={content?.titre || ''}
            onChange={(e) => handleMainTitleChange(e.target.value)}
            placeholder="Titre de la slide..."
            className="w-full bg-slate-900 border border-slate-700 text-white text-xs rounded-lg p-2.5 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
        {cards.map((card, index) => (
          <div key={index} className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-3 relative">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-cyan-400 font-bold">Bloc {index + 1}</span>
              {cards.length > 1 && (
                <button 
                  onClick={() => removeCard(index)}
                  className="text-slate-500 hover:text-rose-400 text-xs"
                >
                  ✕ Supprimer
                </button>
              )}
            </div>

            <div className="grid grid-cols-4 gap-2">
              <input
                type="text"
                value={card.tag}
                onChange={(e) => handleCardChange(index, 'tag', e.target.value)}
                placeholder="Tag"
                className="bg-slate-950 border border-slate-800 text-indigo-400 font-mono text-xs rounded p-2 text-center"
              />
              <input
                type="text"
                value={card.titre}
                onChange={(e) => handleCardChange(index, 'titre', e.target.value)}
                placeholder="Titre de la carte..."
                className="col-span-3 bg-slate-950 border border-slate-800 text-white text-xs rounded p-2"
              />
            </div>

            <textarea
              value={card.description}
              onChange={(e) => handleCardChange(index, 'description', e.target.value)}
              placeholder="Description détaillée..."
              className="w-full h-16 bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded p-2 focus:outline-none focus:border-cyan-500 resize-none"
            />
          </div>
        ))}

        {cards.length < 3 && (
          <button 
            onClick={addCard}
            className="w-full py-2 bg-slate-900/50 hover:bg-slate-900 border border-dashed border-slate-700 text-cyan-400 text-xs rounded-xl transition font-medium"
          >
            + Ajouter une carte Bento
          </button>
        )}
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-300 mb-1">Notes du présentateur</label>
        <textarea
          value={content?.notes || ''}
          onChange={(e) => onChange('notes', e.target.value)}
          className="w-full h-20 bg-slate-900 border border-slate-700 text-white text-xs rounded-lg p-2.5 focus:outline-none focus:border-cyan-500"
          placeholder="Points de discours..."
        />
      </div>
    </div>
  );
};

export const BentoGridNotes = ({ content }) => (
  <div className="space-y-4">
    <h3 className="text-lg font-bold text-cyan-400">Notes</h3>
    <div className="p-3 bg-slate-900 rounded border border-slate-800 min-h-[100px]">
      <p className="text-slate-300 text-sm whitespace-pre-line">
        {content?.notes || "Aucune note spécifique ajoutée pour cette slide."}
      </p>
    </div>
  </div>
);