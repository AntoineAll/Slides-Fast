import React from 'react';

// Rendu visuel de la slide (3 Piliers / Cartes)
export const PiliersVisual = ({ content }) => {
  const pillars = content?.pillars || [
    { icone: '🚀', titre: 'Innovation', desc: 'Repousser les limites technologiques.' },
    { icone: '💎', titre: 'Qualité', desc: 'Une exigence de précision absolue.' },
    { icone: '🤝', titre: 'Confiance', desc: 'Un partenariat durable et transparent.' }
  ];

  return (
    <div className="w-[850px] h-[478px] bg-gray-900 rounded-2xl border-2 border-gray-700 shadow-2xl flex flex-col p-10 relative overflow-hidden flex-shrink-0 box-border justify-between">
      {/* Titre de la slide */}
      <h3 className="text-4xl font-extrabold text-white text-left tracking-tight">
        {content?.titre || 'Nos Valeurs Fondamentales'}
      </h3>

      <div className="flex gap-6 items-stretch h-[280px]">
        {pillars.map((pillar, i) => (
          <div 
            key={i} 
            className="flex-1 bg-gradient-to-b from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-lg transform hover:scale-[1.02] transition-transform"
          >
            {/* Icône / Emoji */}
            <div className="w-16 h-16 bg-blue-600/20 text-3xl flex items-center justify-center rounded-2xl mb-4 border border-blue-500/30 flex-shrink-0">
              {pillar.icone || '📍'}
            </div>

            {/* Texte */}
            <h4 className="text-white font-bold text-lg mb-2 tracking-tight">
              {pillar.titre || 'Pilier ' + (i + 1)}
            </h4>
            <p className="text-gray-400 text-xs leading-relaxed break-words line-clamp-4">
              {pillar.desc || 'Description synthétique de ce point clé...'}
            </p>
          </div>
        ))}
      </div>

    </div>
  );
};

// Formulaire d'édition pour les 3 Piliers
export const PiliersForm = ({ content, onChange }) => {
  const pillars = content?.pillars || [
    { icone: '', titre: '', desc: '' },
    { icone: '', titre: '', desc: '' },
    { icone: '', titre: '', desc: '' }
  ];

  // Grille d'émojis optimisée sur 6 colonnes
  const emojiList = ['🚀', '💡', '💎', '🤝', '⚡', '🌍', '📈', '🎯', '⚙️', '🛡️', '🏆', '⭐'];

  const updatePillar = (index, field, value) => {
    const newPillars = [...pillars];
    newPillars[index] = { ...newPillars[index], [field]: value };
    onChange('pillars', newPillars);
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
          placeholder="Ex: Stratégie de Croissance"
          className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg p-3 focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Édition des Cartes */}
      <div className="space-y-4 border-t border-gray-800 pt-4">
        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Configuration des 3 piliers</h4>
        
        {pillars.slice(0, 3).map((pillar, index) => (
          <div key={index} className="bg-gray-950 p-4 rounded-xl border border-gray-800 space-y-3">
            <div className="flex gap-4 items-start">
              
              {/* Palette de sélection simplifiée prenant moins de hauteur */}
              <div className="w-[180px] flex-shrink-0">
                <label className="block text-[10px] text-gray-500 mb-1">Sélectionner un émoji</label>
                <div className="grid grid-cols-6 gap-1.5 bg-gray-900 p-2 rounded-xl border border-gray-700 w-full">
                  {emojiList.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => updatePillar(index, 'icone', emoji)}
                      className={`text-base p-1.5 rounded-lg hover:bg-gray-700 transition-all flex items-center justify-center ${
                        pillar.icone === emoji ? 'bg-gray-800 ring-2 ring-blue-500 shadow-md' : 'bg-gray-950'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex-1 flex flex-col justify-between space-y-3 h-full">
                <div>
                  <label className="block text-[10px] text-gray-500 mb-1">Émoji personnalisé</label>
                  <input
                    type="text"
                    value={pillar.icone || ''}
                    onChange={(e) => updatePillar(index, 'icone', e.target.value)}
                    placeholder="Saisir un émoji..."
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded p-2 text-xs text-center"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-gray-500 mb-1">Titre du pilier</label>
                  <input
                    type="text"
                    value={pillar.titre || ''}
                    onChange={(e) => updatePillar(index, 'titre', e.target.value)}
                    placeholder="Ex: Innovation"
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded p-2 text-xs"
                  />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-[10px] text-gray-500 mb-1">Description</label>
              <textarea
                value={pillar.desc || ''}
                onChange={(e) => updatePillar(index, 'desc', e.target.value)}
                placeholder="Description courte..."
                rows={2}
                className="w-full bg-gray-800 border border-gray-700 text-white text-xs rounded p-2 resize-none"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};