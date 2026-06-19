import { useState } from 'react';
import { useSlideStore } from '../store/useSlideStore';
import { templates, templateList } from '../templates';

export const Editor = () => {
  const { slides, activeSlideId, updateSlideContent, updateSlideTemplate } = useSlideStore();
  const [activeTab, setActiveTab] = useState('visual'); 
  const [zoomLevel, setZoomLevel] = useState(1); 

  const activeSlide = slides.find((s) => s.id === activeSlideId);

  if (!activeSlide) {
    return (
      <div className="flex-1 bg-gray-800 flex items-center justify-center text-gray-400">
        Sélectionnez une slide dans la barre latérale pour commencer
      </div>
    );
  }

  const handleContentChange = (field, value) => {
    updateSlideContent(activeSlide.id, {
      ...activeSlide.content,
      [field]: value,
    });
  };

  // Gestionnaires de zoom
  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.1, 2.5)); 
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.1, 0.2)); 
  const handleResetZoom = () => setZoomLevel(1);

  // Récupération du template actif depuis le registre centralisé
  const ActiveTemplateVisual = templates[activeSlide.template]?.Visual;
  const ActiveTemplateForm = templates[activeSlide.template]?.Form;

  return (
    <div className="flex-1 bg-gray-800 flex flex-col h-screen overflow-hidden">
      {/* En-tête de l'éditeur */}
      <div className="bg-gray-900 border-b border-gray-700 p-4 flex justify-between items-center flex-shrink-0">
        <div>
          <h2 className="text-white font-semibold">Édition de la Slide</h2>
          <p className="text-xs text-gray-400">Modèle actuel : {templates[activeSlide.template]?.name || activeSlide.template}</p>
        </div>

        {/* Boutons pour switcher entre le formulaire et le visuel */}
        <div className="flex bg-gray-800 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('form')}
            className={`px-4 py-2 text-sm rounded-md transition ${
              activeTab === 'form'
                ? 'bg-blue-600 text-white font-medium'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            Formulaire
          </button>
          <button
            onClick={() => setActiveTab('visual')}
            className={`px-4 py-2 text-sm rounded-md transition ${
              activeTab === 'visual'
                ? 'bg-blue-600 text-white font-medium'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            Visuel
          </button>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="flex-1 overflow-y-auto p-6 flex flex-col">
        {activeTab === 'form' ? (
          /* SECTION FORMULAIRE */
          <div className="max-w-xl mx-auto w-full bg-gray-900 p-6 rounded-xl border border-gray-700 space-y-6">
            
            {/* Sélecteur de template visuel */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Changer de modèle visuel
              </label>
              <select
                value={activeSlide.template}
                onChange={(e) => updateSlideTemplate(activeSlide.id, e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg p-3 focus:outline-none focus:border-blue-500"
              >
                {templateList.map((tmpl) => (
                  <option key={tmpl.id} value={tmpl.id}>
                    {tmpl.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="border-t border-gray-800 pt-4">
              {/* Formulaire dynamique selon le template sélectionné */}
              {ActiveTemplateForm ? (
                <ActiveTemplateForm 
                  content={activeSlide.content} 
                  onChange={handleContentChange} 
                />
              ) : (
                <p className="text-gray-500 italic text-center py-4">Aucun formulaire disponible pour ce modèle</p>
              )}
            </div>
          </div>
        ) : (
          /* VUE VISUEL */
          <div className="flex-1 flex flex-col relative overflow-hidden bg-gray-950 rounded-2xl border border-gray-700/50 shadow-inner">
            
            {/* Contrôles de zoom */}
            <div className="absolute top-4 right-4 bg-gray-900/90 border border-gray-700/80 p-2 rounded-xl flex items-center gap-1.5 shadow-xl z-10 backdrop-blur-sm">
              <button 
                onClick={handleZoomOut} 
                className="w-8 h-8 flex items-center justify-center text-lg font-bold text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition"
                title="Dézoomer"
              >
                -
              </button>
              <button 
                onClick={handleResetZoom} 
                className="px-3 py-1.5 text-xs font-mono text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg min-w-[55px] text-center transition"
                title="Réinitialiser le zoom (100%)"
              >
                {Math.round(zoomLevel * 100)}%
              </button>
              <button 
                onClick={handleZoomIn} 
                className="w-8 h-8 flex items-center justify-center text-lg font-bold text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition"
                title="Zoomer"
              >
                +
              </button>
            </div>

            {/* ZONE DE SCROLL */}
            <div className="flex-1 w-full h-full overflow-auto flex items-center justify-center p-6">
              
              {/* Rendu dynamique du template visuel avec application du zoom */}
              <div
                style={{ transform: `scale(${zoomLevel})` }}
                className="origin-center transition-transform duration-200 ease-out flex-shrink-0"
              >
                {ActiveTemplateVisual ? (
                  <ActiveTemplateVisual content={activeSlide.content} />
                ) : (
                  <div className="w-[850px] aspect-video bg-gray-900 rounded-2xl border-2 border-gray-700 shadow-2xl flex items-center justify-center text-gray-500">
                    Modèle visuel non reconnu
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};