import React from 'react';

// Rendu visuel de la slide (Diagramme + Légende)
export const DiagrammeCirculaireVisual = ({ content }) => {
  const parts = content?.parts || [];
  const unite = content?.unite || 'quantite'; // 'quantite' ou 'pourcentage'
  
  // Calcul de la somme totale pour les calculs de proportion
  const total = parts.reduce((sum, p) => sum + Number(p.valeur || 0), 0);

  // Génération des portions du diagramme circulaire en SVG
  let cumulativePercent = 0;
  const svgSlices = parts.map((part, index) => {
    const value = Number(part.valeur || 0);
    if (total === 0 || value === 0) return null;
    
    const percent = value / total;
    const startPercent = cumulativePercent;
    const endPercent = cumulativePercent + percent;
    cumulativePercent += percent;

    const [startX, startY] = [Math.cos(2 * Math.PI * startPercent), Math.sin(2 * Math.PI * startPercent)];
    const [endX, endY] = [Math.cos(2 * Math.PI * endPercent), Math.sin(2 * Math.PI * endPercent)];

    const largeArcFlag = percent > 0.5 ? 1 : 0;

    const pathData = [
      `M 0 0`,
      `L ${startX} ${startY}`,
      `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`,
      `Z`
    ].join(' ');

    return (
      <path
        key={index}
        d={pathData}
        fill={part.couleur || '#3B82F6'}
        stroke="#1F2937"
        strokeWidth="0.02"
      />
    );
  });

  return (
    <div className="w-[850px] aspect-video bg-gray-900 rounded-2xl border-2 border-gray-700 shadow-2xl flex flex-col justify-between p-8 relative overflow-hidden flex-shrink-0">
      {/* Titre en haut */}
      <h3 className="text-4xl font-extrabold text-white text-center tracking-tight break-words max-w-full">
        {content?.titre || 'Aucun titre'}
      </h3>
      
      {/* Contenu : Diagramme à gauche, Légende à droite */}
      <div className="flex-1 flex items-center justify-around px-4">
        {/* Diagramme Circulaire (SVG centré) */}
        <div className="w-[320px] h-[320px] flex items-center justify-center">
          {parts.length > 0 && total > 0 ? (
            <svg viewBox="-1.1 -1.1 2.2 2.2" className="w-full h-full transform -rotate-90">
              {svgSlices}
              <circle cx="0" cy="0" r="0.45" fill="#111827" />
            </svg>
          ) : (
            <div className="text-gray-500 italic text-center text-sm">
              Ajoutez des parts avec des valeurs &gt; 0
            </div>
          )}
        </div>

        {/* Légende (à droite) */}
        <div className="w-[300px] bg-gray-950/40 border border-gray-800 p-4 rounded-xl max-h-[280px] overflow-y-auto space-y-3">
          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Répartition :
          </h4>
          {parts.length > 0 ? (
            parts.map((part, index) => {
              const value = Number(part.valeur || 0);
              const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
              
              // Affichage conditionnel selon l'unité choisie
              const displayValue = unite === 'pourcentage' 
                ? `${percentage}%` 
                : `${value} (${percentage}%)`;

              return (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 overflow-hidden pr-2">
                    <span 
                      className="w-3.5 h-3.5 rounded-full flex-shrink-0" 
                      style={{ backgroundColor: part.couleur || '#3B82F6' }}
                    />
                    <span className="text-gray-300 font-medium truncate" title={part.label || `Part ${index + 1}`}>
                      {part.label || `Part ${index + 1}`}
                    </span>
                  </div>
                  <span className="text-gray-400 font-mono text-xs">
                    {displayValue}
                  </span>
                </div>
              );
            })
          ) : (
            <div className="text-gray-600 text-xs italic">Aucune part définie</div>
          )}
        </div>
      </div>
    </div>
  );
};

// Formulaire d'édition dynamique
export const DiagrammeCirculaireForm = ({ content, onChange }) => {
  const parts = content?.parts || [{ label: '', valeur: 10, couleur: '#3B82F6' }, { label: '', valeur: 20, couleur: '#10B981' }, { label: '', valeur: 30, couleur: '#F59E0B' }];
  const unite = content?.unite || 'quantite';

  const updateParts = (newParts) => {
    onChange('parts', newParts);
  };

  // Gestion du nombre de parts (entre 2 et 10)
  const handleCountChange = (count) => {
    let updated = [...parts];
    if (count > updated.length) {
      const colors = ['#8B5CF6', '#EC4899', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#6366F1'];
      while(updated.length < count) {
        updated.push({ 
          label: '', 
          valeur: 10, 
          couleur: colors[updated.length % colors.length] 
        });
      }
    } else {
      updated = updated.slice(0, count);
    }
    updateParts(updated);
  };

  const handlePartChange = (index, field, value) => {
    const updated = parts.map((part, i) => 
      i === index ? { ...part, [field]: value } : part
    );
    updateParts(updated);
  };

  return (
    <div className="space-y-6">
      {/* Choix de l'unité (Quantité ou Pourcentage) */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Unité d'affichage des parts
        </label>
        <div className="flex bg-gray-950 p-1 rounded-xl border border-gray-800">
          <button
            type="button"
            onClick={() => onChange('unite', 'quantite')}
            className={`flex-1 py-2.5 text-xs font-semibold rounded-lg transition ${
              unite === 'quantite'
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Quantités (Valeurs brutes)
          </button>
          <button
            type="button"
            onClick={() => onChange('unite', 'pourcentage')}
            className={`flex-1 py-2.5 text-xs font-semibold rounded-lg transition ${
              unite === 'pourcentage'
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Pourcentages (%)
          </button>
        </div>
      </div>

      {/* Contrôle du nombre de parts */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Nombre de parts (2 à 10)
        </label>
        <select
          value={parts.length}
          onChange={(e) => handleCountChange(Number(e.target.value))}
          className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg p-3 focus:outline-none focus:border-blue-500"
        >
          {[...Array(9)].map((_, i) => (
            <option key={i + 2} value={i + 2}>
              {i + 2} parts
            </option>
          ))}
        </select>
      </div>

      {/* Édition de chaque part */}
      <div className="space-y-4 border-t border-gray-800 pt-4">
        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Configuration des parts
        </h4>
        
        {parts.map((part, index) => (
          <div key={index} className="grid grid-cols-12 gap-2 items-center bg-gray-950 p-3 rounded-xl border border-gray-800/50">
            <div className="col-span-5">
              <input
                type="text"
                value={part.label || ''}
                onChange={(e) => handlePartChange(index, 'label', e.target.value)}
                placeholder={`Libellé ${index + 1}`}
                className="w-full bg-gray-800 border border-gray-700 text-white text-xs rounded-lg p-2 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="col-span-3">
              <input
                type="number"
                value={part.valeur || ''}
                onChange={(e) => handlePartChange(index, 'valeur', Number(e.target.value))}
                placeholder={unite === 'pourcentage' ? '%' : 'Valeur'}
                className="w-full bg-gray-800 border border-gray-700 text-white text-xs rounded-lg p-2 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="col-span-4 flex items-center gap-2 justify-end">
              <span className="text-[10px] text-gray-500">Couleur :</span>
              <input
                type="color"
                value={part.couleur || '#3B82F6'}
                onChange={(e) => handlePartChange(index, 'couleur', e.target.value)}
                className="w-8 h-8 rounded border-0 cursor-pointer bg-transparent"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};