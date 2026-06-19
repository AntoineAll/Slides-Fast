import React from 'react';

// Rendu visuel de la slide Timeline
export const TimelineVisual = ({ content }) => {
  const steps = content?.steps || [
    { date: '2023', titre: 'Lancement', desc: 'Initialisation du projet' },
    { date: '2024', titre: 'Expansion', desc: 'Déploiement à l\'international' }
  ];

  return (
    <div className="w-[850px] aspect-video bg-gray-900 rounded-2xl border-2 border-gray-700 shadow-2xl flex flex-col p-12 relative overflow-hidden flex-shrink-0">
      {/* Titre de la slide */}
      <h3 className="text-4xl font-extrabold text-white text-center mb-16 tracking-tight">
        {content?.titre || 'Feuille de route'}
      </h3>

      <div className="relative flex-1 flex items-center justify-center">
        {/* La ligne de fond */}
        <div className="absolute h-1 bg-gray-700 w-full top-1/2 transform -translate-y-1/2 z-0"></div>

        {/* Les étapes */}
        <div className="flex justify-between w-full z-10">
          {steps.map((step, i) => (
            <div key={i} className="flex flex-col items-center group" style={{ width: `${100 / steps.length}%` }}>
              {/* Date / Label en haut */}
              <div className="mb-4 text-blue-400 font-mono text-sm font-bold bg-gray-900 px-2">
                {step.date || 'Etape ' + (i + 1)}
              </div>

              {/* Le point sur la ligne */}
              <div className="w-6 h-6 bg-blue-600 border-4 border-gray-900 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.5)] mb-4"></div>

              {/* Titre et description en bas */}
              <div className="text-center px-2">
                <h4 className="text-white font-bold text-sm mb-1 break-words line-clamp-2">
                  {step.titre || 'Titre'}
                </h4>
                <p className="text-gray-400 text-[11px] leading-tight break-words line-clamp-3">
                  {step.desc || 'Description...'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Formulaire pour la Timeline
export const TimelineForm = ({ content, onChange }) => {
  const steps = content?.steps || [{ date: '', titre: '', desc: '' }];

  const updateSteps = (newSteps) => {
    onChange('steps', newSteps);
  };

  const handleStepChange = (index, field, value) => {
    const updated = steps.map((s, i) => (i === index ? { ...s, [field]: value } : s));
    updateSteps(updated);
  };

  const addStep = () => {
    if (steps.length < 5) {
      updateSteps([...steps, { date: '', titre: '', desc: '' }]);
    }
  };

  const removeStep = (index) => {
    if (steps.length > 1) {
      updateSteps(steps.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Titre de la slide</label>
        <input
          type="text"
          value={content?.titre || ''}
          onChange={(e) => onChange('titre', e.target.value)}
          placeholder="Ex: Roadmap 2024"
          className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg p-3 focus:outline-none focus:border-blue-500"
        />
      </div>

      <div className="space-y-4 border-t border-gray-800 pt-4">
        <div className="flex justify-between items-center">
          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Étapes (max 5)</h4>
          <button 
            onClick={addStep}
            disabled={steps.length >= 5}
            className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-2 py-1 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            + Ajouter
          </button>
        </div>

        {steps.map((step, index) => (
          <div key={index} className="bg-gray-950 p-4 rounded-xl border border-gray-800 space-y-3 relative group">
            <button 
              onClick={() => removeStep(index)}
              className="absolute top-2 right-2 text-gray-600 hover:text-rose-500"
            >
              ✕
            </button>
            <div className="grid grid-cols-3 gap-2">
              <input
                type="text"
                value={step.date}
                onChange={(e) => handleStepChange(index, 'date', e.target.value)}
                placeholder="Date/Label"
                className="bg-gray-800 border border-gray-700 text-white text-xs rounded p-2"
              />
              <input
                type="text"
                value={step.titre}
                onChange={(e) => handleStepChange(index, 'titre', e.target.value)}
                placeholder="Titre"
                className="col-span-2 bg-gray-800 border border-gray-700 text-white text-xs rounded p-2"
              />
            </div>
            <textarea
              value={step.desc}
              onChange={(e) => handleStepChange(index, 'desc', e.target.value)}
              placeholder="Description courte..."
              rows={2}
              className="w-full bg-gray-800 border border-gray-700 text-white text-xs rounded p-2 resize-none"
            />
          </div>
        ))}
      </div>
    </div>
  );
};