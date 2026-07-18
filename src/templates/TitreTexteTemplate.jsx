import React from 'react';

// Rendu visuel de la slide (Titre et Texte)
export const TitreTexteVisual = ({ content }) => (
  <div className="w-[850px] aspect-video bg-gray-900 rounded-2xl border-2 border-gray-700 shadow-2xl flex flex-col items-center justify-center p-12 relative overflow-hidden flex-shrink-0 text-center">
    <h3 className="text-5xl font-extrabold text-white mb-6 tracking-tight break-words max-w-full">
      {content?.titre || 'Aucun titre'}
    </h3>
    
    <div className="max-w-2xl text-lg text-gray-300 font-medium break-words">
      {content?.texte || 'Aucun texte ajouté pour le moment...'}
    </div>
  </div>
);

// Formulaire d'édition pour Titre et Texte
export const TitreTexteForm = ({ content, onChange }) => (
  <div className="space-y-4">
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1">
        Titre de la slide
      </label>
      <input
        type="text"
        value={content?.titre || ''}
        onChange={(e) => onChange('titre', e.target.value)}
        placeholder="Entrez votre titre..."
        className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg p-3 focus:outline-none focus:border-blue-500"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1">
        Contenu textuel
      </label>
      <textarea
        value={content?.texte || ''}
        onChange={(e) => onChange('texte', e.target.value)}
        placeholder="Saisissez votre texte ici..."
        rows={4}
        className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg p-3 focus:outline-none focus:border-blue-500 resize-none"
      />
    </div>
    {/* Notes du présentateur */}
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1">
        Notes du présentateur
      </label>
      <textarea
        value={content?.notes || ''}
        onChange={(e) => onChange('notes', e.target.value)}
        placeholder="Ajoutez vos points de discours ici..."
        rows={3}
        className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg p-3 focus:outline-none focus:border-blue-500"
      />
    </div>
  </div>
);

// Composant de notes pour le PresenterMode
export const TitreTexteNotes = ({ content }) => (
  <div className="space-y-4">
    <h3 className="text-lg font-bold text-blue-400">Notes</h3>
    <div className="p-3 bg-gray-800 rounded border border-gray-700 min-h-[100px]">
      <p className="text-gray-300 text-sm whitespace-pre-line">
        {content?.notes || "Aucune note spécifique ajoutée pour cette slide."}
      </p>
    </div>
  </div>
);