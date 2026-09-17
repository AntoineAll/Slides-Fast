import { useEffect } from 'react';
import { templateList, templateCategories } from '../templates';
import { templatePreviewContent } from '../data/templatePreviewContent';

const SLIDE_WIDTH = 850;
const SLIDE_HEIGHT = 478; // même format 16:9 que l'aperçu de l'éditeur
const THUMB_WIDTH = 220;
const THUMB_SCALE = THUMB_WIDTH / SLIDE_WIDTH;
const THUMB_HEIGHT = SLIDE_HEIGHT * THUMB_SCALE;

const TemplateCard = ({ tmpl, isActive, onClick }) => {
  const Visual = tmpl.Visual;

  return (
    <button
      onClick={onClick}
      className={`text-left rounded-xl border-2 p-2 transition ${
        isActive ? 'border-blue-500 bg-blue-500/5' : 'border-transparent hover:border-gray-700'
      }`}
    >
      {/* Le Visual garde sa mise en page réelle à taille normale (850x478), juste réduit
          par un scale CSS : jamais déformé, toujours fidèle à ce que donnera la vraie slide. */}
      <div style={{ width: THUMB_WIDTH, height: THUMB_HEIGHT }} className="relative overflow-hidden rounded-lg bg-gray-950 shadow-md">
        <div
          style={{ width: SLIDE_WIDTH, height: SLIDE_HEIGHT, transform: `scale(${THUMB_SCALE})`, transformOrigin: 'top left' }}
          className="absolute top-0 left-0 pointer-events-none"
        >
          <Visual content={templatePreviewContent[tmpl.id]} />
        </div>
      </div>
      <p className={`mt-2 px-0.5 text-xs font-medium truncate ${isActive ? 'text-blue-400' : 'text-gray-300'}`}>
        {tmpl.name}
      </p>
    </button>
  );
};

// Sélecteur de modèle en grille visuelle : chaque modèle est rendu avec un contenu
// d'exemple accrocheur (voir templatePreviewContent) plutôt que d'être choisi à l'aveugle
// dans un menu texte. Regroupé par catégorie, comme le <select> de l'onglet Formulaire.
export const TemplatePicker = ({ currentTemplateId, onSelect, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleSelect = (templateId) => {
    onSelect(templateId);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-6" onClick={onClose}>
      <div
        className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between px-6 py-4 border-b border-gray-800 flex-shrink-0">
          <h2 className="text-white font-semibold">Choisir un modèle</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition" title="Fermer (Échap)">
            ✕
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {templateCategories.map((category) => {
            const items = templateList.filter((tmpl) => tmpl.category === category);
            if (items.length === 0) return null;

            return (
              <div key={category}>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">{category}</h3>
                <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(auto-fill, minmax(${THUMB_WIDTH}px, 1fr))` }}>
                  {items.map((tmpl) => (
                    <TemplateCard
                      key={tmpl.id}
                      tmpl={tmpl}
                      isActive={tmpl.id === currentTemplateId}
                      onClick={() => handleSelect(tmpl.id)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
