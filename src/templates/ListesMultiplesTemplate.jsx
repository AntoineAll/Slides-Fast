import React from 'react';

// Rendu visuel de la slide (Listes Multiples)
export const ListesMultiplesVisual = ({ content }) => {
  const lists = content?.lists || [
    { titre: 'Catégorie 1', items: ['Élément A', 'Élément B'] },
    { titre: 'Catégorie 2', items: ['Élément C', 'Élément D'] },
    { titre: 'Catégorie 3', items: ['Élément E', 'Élément F'] },
  ];

  return (
    <div className="w-[850px] aspect-video bg-gray-900 rounded-2xl border-2 border-gray-700 shadow-2xl flex flex-col p-10 relative overflow-hidden flex-shrink-0">
      {/* Titre de la slide */}
      <h3 className="text-4xl font-extrabold text-white text-center mb-8 tracking-tight break-words max-w-full">
        {content?.titre || 'Mes listes d\'éléments'}
      </h3>

      <div className="flex-1 grid grid-cols-3 gap-6">
        {lists.map((list, colIndex) => (
          <div key={colIndex} className="bg-gray-800/40 border border-gray-700/60 rounded-xl p-5 flex flex-col">
            <h4 className="text-blue-400 font-bold text-lg mb-3 border-b border-gray-700 pb-2 break-words">
              {list.titre || `Liste ${colIndex + 1}`}
            </h4>
            <ul className="space-y-2">
              {list.items && list.items.length > 0 ? (
                list.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="text-gray-200 text-sm flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span className="break-words">{item || '...'}</span>
                  </li>
                ))
              ) : (
                <li className="text-gray-500 text-xs italic">Aucun élément</li>
              )}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

// Formulaire d'édition pour les Listes Multiples
export const ListesMultiplesForm = ({ content, onChange }) => {
  const lists = content?.lists || [
    { titre: 'Catégorie 1', items: [''] },
    { titre: 'Catégorie 2', items: [''] },
    { titre: 'Catégorie 3', items: [''] },
  ];

  // Mise à jour du titre global de la slide
  const handleMainTitleChange = (val) => {
    onChange('titre', val);
  };

  // Mise à jour du titre d'une liste spécifique
  const handleListTitleChange = (listIndex, val) => {
    const updatedLists = [...lists];
    updatedLists[listIndex] = { ...updatedLists[listIndex], titre: val };
    onChange('lists', updatedLists);
  };

  // Mise à jour d'un item précis dans une liste spécifique
  const handleItemChange = (listIndex, itemIndex, val) => {
    const updatedLists = [...lists];
    const updatedItems = [...updatedLists[listIndex].items];
    updatedItems[itemIndex] = val;
    updatedLists[listIndex] = { ...updatedLists[listIndex], items: updatedItems };
    onChange('lists', updatedLists);
  };

  // Ajout d'un item dans une liste (limité à 5 pour le design)
  const addItem = (listIndex) => {
    const updatedLists = [...lists];
    if (updatedLists[listIndex].items.length < 5) {
      updatedLists[listIndex] = {
        ...updatedLists[listIndex],
        items: [...updatedLists[listIndex].items, ''],
      };
      onChange('lists', updatedLists);
    }
  };

  // Suppression d'un item
  const removeItem = (listIndex, itemIndex) => {
    const updatedLists = [...lists];
    if (updatedLists[listIndex].items.length > 1) {
      const updatedItems = updatedLists[listIndex].items.filter((_, i) => i !== itemIndex);
      updatedLists[listIndex] = { ...updatedLists[listIndex], items: updatedItems };
      onChange('lists', updatedLists);
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
          onChange={(e) => handleMainTitleChange(e.target.value)}
          placeholder="Ex: Répartition des tâches..."
          className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg p-3 focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Édition des 3 colonnes de listes */}
      <div className="grid grid-cols-3 gap-3">
        {lists.map((list, listIndex) => (
          <div key={listIndex} className="space-y-3 bg-gray-900/60 p-3 rounded-xl border border-gray-800">
            <input
              type="text"
              value={list.titre}
              onChange={(e) => handleListTitleChange(listIndex, e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 text-blue-400 font-bold text-sm rounded-lg p-2 focus:outline-none"
              placeholder={`Titre liste ${listIndex + 1}`}
            />
            
            <div className="space-y-2">
              {list.items.map((item, itemIndex) => (
                <div key={itemIndex} className="flex gap-1">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleItemChange(listIndex, itemIndex, e.target.value)}
                    className="flex-1 bg-gray-800 border border-gray-700 text-white text-xs rounded p-2"
                    placeholder="Élément..."
                  />
                  <button 
                    onClick={() => removeItem(listIndex, itemIndex)} 
                    className="text-gray-500 hover:text-rose-500 px-1 text-xs"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <button 
              onClick={() => addItem(listIndex)}
              className="w-full py-1 border border-dashed border-gray-700 text-gray-400 hover:text-white text-xs rounded transition"
            >
              + Élément
            </button>
          </div>
        ))}
      </div>

      {/* Champ Notes pour le PresenterMode */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Notes du présentateur</label>
        <textarea
          value={content?.notes || ''}
          onChange={(e) => onChange('notes', e.target.value)}
          className="w-full h-24 bg-gray-800 border border-gray-700 text-white rounded-lg p-3 focus:outline-none focus:border-blue-500"
          placeholder="Ajoutez vos points de discours ici..."
        />
      </div>
    </div>
  );
};

// Composant de notes pour le PresenterMode
export const ListesMultiplesNotes = ({ content }) => (
  <div className="space-y-4">
    <h3 className="text-lg font-bold text-blue-400">Notes</h3>
    <div className="p-3 bg-gray-800 rounded border border-gray-700 min-h-[100px]">
      <p className="text-gray-300 text-sm whitespace-pre-line">
        {content?.notes || "Aucune note spécifique ajoutée pour cette slide."}
      </p>
    </div>
  </div>
);