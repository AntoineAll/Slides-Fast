import React, { useState, useEffect } from 'react';
import { useSlideStore } from '../store/useSlideStore';
import { templates } from '../templates';

export const Presentation = ({ onExit }) => {
  const { slides } = useSlideStore();
  const [currentIndex, setCurrentIndex] = useState(0);

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
      <div style={{ transform: 'scale(1.5)' }}>
        {templates[slides[currentIndex].templateId]?.Visual({ content: slides[currentIndex].content })}
      </div>
      {/* Bouton de sortie propre pour ceux qui ne veulent pas utiliser Echap */}
      <button 
        onClick={onExit}
        className="absolute top-4 right-4 text-gray-500 hover:text-white"
      >
        Fermer
      </button>
    </div>
  );
};