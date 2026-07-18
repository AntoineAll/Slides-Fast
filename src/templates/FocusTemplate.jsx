import React from 'react';

// Rendu visuel de la slide (Focus / Spotlight)
export const FocusVisual = ({ content }) => {
  return (
    <div className="w-[850px] h-[478px] bg-slate-950 rounded-2xl border-2 border-slate-700 shadow-2xl flex relative overflow-hidden flex-shrink-0 box-border">
      {/* Côté gauche : Zone visuelle forte */}
      <div className="w-1/3 bg-blue-600 flex items-center justify-center p-8 relative">
        <div className="text-8xl">{content?.icone || '💡'}</div>
      </div>

      {/* Côté droit : Contenu textuel */}
      <div className="w-2/3 p-12 flex flex-col justify-center bg-gradient-to-r from-slate-950 to-slate-900">
        <h2 className="text-4xl font-extrabold text-white mb-6 leading-tight">
          {content?.titre || 'Le sujet principal'}
        </h2>
        <p className="text-slate-300 text-lg leading-relaxed border-l-4 border-blue-600 pl-6">
          {content?.desc || 'Présentez ici l\'idée maîtresse de votre présentation. Ce template est conçu pour isoler une information cruciale et la rendre inoubliable.'}
        </p>
      </div>
    </div>
  );
};

// Formulaire d'édition pour le template Focus
export const FocusForm = ({ content, onChange }) => {
  // Liste d'émojis suggérés pour la sélection rapide
  const emojiList = ['💡', '🚀', '🎯', '⚡', '💎', '📈', '🔥', '🛡️', '⚙️', '🌍', '🏆', '⭐'];

  return (
    <div className="space-y-6">
      {/* Sélecteur d'émojis visuel */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Choisir un icône</label>
        <div className="grid grid-cols-6 gap-2 bg-gray-950 p-3 rounded-xl border border-gray-800">
          {emojiList.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => onChange('icone', emoji)}
              className={`text-2xl p-2 rounded-lg hover:bg-gray-700 transition-all ${
                (content?.icone || '💡') === emoji ? 'bg-gray-800 ring-2 ring-blue-500 shadow-md' : 'bg-gray-900'
              }`}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      {/* Titre */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Titre</label>
        <input
          type="text"
          value={content?.titre || ''}
          onChange={(e) => onChange('titre', e.target.value)}
          placeholder="Ex: Stratégie Clé"
          className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg p-3 focus:border-blue-500 focus:outline-none"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
        <textarea
          value={content?.desc || ''}
          onChange={(e) => onChange('desc', e.target.value)}
          placeholder="Détails importants..."
          rows={4}
          className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg p-3 focus:border-blue-500 focus:outline-none resize-none"
        />
      </div>

      {/* Notes du présentateur */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Notes du présentateur</label>
        <textarea
          value={content?.notes || ''}
          onChange={(e) => onChange('notes', e.target.value)}
          placeholder="Ajoutez vos points de discours ici..."
          rows={3}
          className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg p-3 focus:border-blue-500 focus:outline-none resize-none"
        />
      </div>
    </div>
  );
};

// Composant de notes pour le PresenterMode
export const FocusNotes = ({ content }) => (
  <div className="space-y-4">
    <h3 className="text-lg font-bold text-blue-400">Notes</h3>
    <div className="p-3 bg-gray-800 rounded border border-gray-700 min-h-[100px]">
      <p className="text-gray-300 text-sm whitespace-pre-line">
        {content?.notes || "Aucune note spécifique ajoutée pour cette slide."}
      </p>
    </div>
  </div>
);