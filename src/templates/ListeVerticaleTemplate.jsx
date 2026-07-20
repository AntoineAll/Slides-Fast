import React from 'react';

// Rendu visuel de la slide (Sections en colonnes compactes avec des polices optimisées)
export const ListeVerticaleVisual = ({ content }) => {
  const sections = content?.sections || [
    { titre: 'Première section', items: ['Élément 1', 'Élément 2'] },
  ];

  const gridColsClass = 
    sections.length === 1 ? 'grid-cols-1 max-w-xl mx-auto w-full' :
    sections.length === 2 ? 'grid-cols-2' : 'grid-cols-3';

  return (
    <div className="w-[850px] aspect-video bg-gray-900 rounded-2xl border-2 border-gray-700 shadow-2xl flex flex-col p-8 relative overflow-hidden flex-shrink-0">
      {/* Titre de la slide */}
      <h3 className="text-3xl font-extrabold text-white text-center mb-6 tracking-tight break-words max-w-full">
        {content?.titre || 'Titre de la slide'}
      </h3>

      <div className={`flex-1 grid ${gridColsClass} gap-4 items-start`}>
        {sections.map((section, sIndex) => (
          <div key={sIndex} className="bg-gray-800/40 border border-gray-700/60 rounded-xl p-4 flex flex-col h-full">
            {section.titre && (
              <h4 className="text-blue-400 font-bold text-base mb-3 border-b border-gray-700 pb-1.5 break-words">
                {section.titre}
              </h4>
            )}
            <ul className="space-y-4.5 flex-1">
              {section.items && section.items.length > 0 ? (
                section.items.map((item, iIndex) => (
                  <li key={iIndex} className="text-gray-200 text-sm flex items-start gap-2">
                    <span className="text-blue-500 font-bold select-none mt-0.5">•</span>
                    <span className="break-words flex-1">{item || '...'}</span>
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

// Formulaire d'édition pour la Liste Verticale Séquencée
export const ListeVerticaleForm = ({ content, onChange }) => {
  const sections = content?.sections || [
    { titre: '', items: [''] }
  ];

  const handleMainTitleChange = (val) => {
    onChange('titre', val);
  };

  const handleSectionTitleChange = (sectionIndex, val) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex] = { ...updatedSections[sectionIndex], titre: val };
    onChange('sections', updatedSections);
  };

  const handleItemChange = (sectionIndex, itemIndex, val) => {
    const updatedSections = [...sections];
    const updatedItems = [...updatedSections[sectionIndex].items];
    updatedItems[itemIndex] = val;
    updatedSections[sectionIndex] = { ...updatedSections[sectionIndex], items: updatedItems };
    onChange('sections', updatedSections);
  };

  const addSection = () => {
    if (sections.length < 3) {
      onChange('sections', [...sections, { titre: '', items: [''] }]);
    }
  };

  const removeSection = (sectionIndex) => {
    if (sections.length > 1) {
      const updatedSections = sections.filter((_, i) => i !== sectionIndex);
      onChange('sections', updatedSections);
    }
  };

  const addItem = (sectionIndex) => {
    const updatedSections = [...sections];
    if (updatedSections[sectionIndex].items.length < 5) {
      updatedSections[sectionIndex] = {
        ...updatedSections[sectionIndex],
        items: [...updatedSections[sectionIndex].items, ''],
      };
      onChange('sections', updatedSections);
    }
  };

  const removeItem = (sectionIndex, itemIndex) => {
    const updatedSections = [...sections];
    if (updatedSections[sectionIndex].items.length > 1) {
      const updatedItems = updatedSections[sectionIndex].items.filter((_, i) => i !== itemIndex);
      updatedSections[sectionIndex] = { ...updatedSections[sectionIndex], items: updatedItems };
      onChange('sections', updatedSections);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Titre de la slide</label>
        <input
          type="text"
          value={content?.titre || ''}
          onChange={(e) => handleMainTitleChange(e.target.value)}
          placeholder="Ex: Programme de la session..."
          className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg p-3 focus:outline-none focus:border-blue-500"
        />
      </div>

      <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
        {sections.map((section, sIndex) => (
          <div key={sIndex} className="bg-gray-900/60 p-4 rounded-xl border border-gray-800 space-y-3 relative">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={section.titre}
                onChange={(e) => handleSectionTitleChange(sIndex, e.target.value)}
                className="flex-1 bg-gray-800 border border-gray-700 text-blue-400 font-bold text-sm rounded-lg p-2 focus:outline-none"
                placeholder="Titre de la section (optionnel)..."
              />
              {sections.length > 1 && (
                <button 
                  onClick={() => removeSection(sIndex)}
                  className="text-gray-500 hover:text-rose-500 text-xs px-2 py-1"
                  title="Supprimer la section"
                >
                  ✕ Supprimer
                </button>
              )}
            </div>

            <div className="space-y-2">
              {section.items.map((item, iIndex) => (
                <div key={iIndex} className="flex gap-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleItemChange(sIndex, iIndex, e.target.value)}
                    className="flex-1 bg-gray-800 border border-gray-700 text-white text-xs rounded p-2"
                    placeholder="Élément de la liste..."
                  />
                  <button 
                    onClick={() => removeItem(sIndex, iIndex)} 
                    className="text-gray-500 hover:text-rose-500 px-1 text-xs"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <button 
              onClick={() => addItem(sIndex)}
              className="w-full py-1.5 border border-dashed border-gray-700 text-gray-400 hover:text-white text-xs rounded transition"
            >
              + Ajouter un élément
            </button>
          </div>
        ))}

        {sections.length < 3 && (
          <button 
            onClick={addSection}
            className="w-full py-2.5 bg-gray-800/50 hover:bg-gray-800 border border-dashed border-gray-600 text-blue-400 text-xs rounded-xl transition font-medium"
          >
            + Ajouter une nouvelle section
          </button>
        )}
      </div>

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

export const ListeVerticaleNotes = ({ content }) => (
  <div className="space-y-4">
    <h3 className="text-lg font-bold text-blue-400">Notes</h3>
    <div className="p-3 bg-gray-800 rounded border border-gray-700 min-h-[100px]">
      <p className="text-gray-300 text-sm whitespace-pre-line">
        {content?.notes || "Aucune note spécifique ajoutée pour cette slide."}
      </p>
    </div>
  </div>
);