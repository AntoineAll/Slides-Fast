import React, { useState, useEffect } from 'react';
import { useSlideStore } from '../store/useSlideStore';
import { templates } from '../templates';
import { useViewportFitScale } from '../hooks/useViewportFitScale';

export const Presentation = ({ onExit }) => {
  const { slides, logoUrl } = useSlideStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  // Un zoom fixe (ex: scale(1.5)) peut dépasser la hauteur de la fenêtre sur un petit écran
  // et couper silencieusement le bas de la slide (typiquement une légende sous l'image).
  const scale = useViewportFitScale(850, 478);

  // Sync avec le présentateur
  useEffect(() => {
    const channel = new BroadcastChannel('slide_sync');
    channel.onmessage = (e) => { if (e.data.type === 'GOTO') setCurrentIndex(e.data.index); };
    return () => channel.close();
  }, []);

  // Navigation simple : juste les flèches. PAS D'ESCAPEMENT.
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' && currentIndex < slides.length - 1) setCurrentIndex(p => p + 1);
      if (e.key === 'ArrowLeft' && currentIndex > 0) setCurrentIndex(p => p - 1);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, slides.length]);

  if (!slides.length) return null;

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      <div style={{ transform: `scale(${scale})` }}>
        {templates[slides[currentIndex].templateId]?.Visual({ content: slides[currentIndex].content })}
      </div>
      {/* Bouton de sortie propre pour ceux qui ne veulent pas utiliser Echap */}
      <button
        onClick={onExit}
        className="absolute top-4 right-4 text-gray-500 hover:text-white"
      >
        Fermer
      </button>

      {/* Repère : numéro de la slide actuelle */}
      <div className="absolute bottom-5 right-5 text-blue-800 font-mono tabular-nums">
        {currentIndex + 1}
      </div>

      {/* Logo de la présentation. Beaucoup de logos ont déjà leur propre forme et fond
          (badge rond, bannière rectangulaire, texte seul...) : leur imposer un cadre/fond
          à nous par-dessus double le contour et fait moche. On se contente donc de borner
          sa taille en conservant ses proportions, sans rien ajouter autour. */}
      {logoUrl && (
        <img src={logoUrl} alt="" className="absolute bottom-5 left-5 max-h-10 max-w-[180px] object-contain opacity-90" />
      )}
    </div>
  );
};