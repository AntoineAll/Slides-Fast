import React, { useState, useEffect } from 'react';
import { useSlideStore } from '../store/useSlideStore';
import { templates } from '../templates';

export const Presentation = ({ onExit }) => {
  const { slides } = useSlideStore();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' && currentIndex < slides.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
        setCurrentIndex((prev) => prev - 1);
      } else if (e.key === 'Escape') {
        onExit();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, slides.length, onExit]);

  if (!slides || slides.length === 0) return null;

  const currentSlide = slides[currentIndex];
  const TemplateVisual = templates[currentSlide?.templateId]?.Visual;

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      {TemplateVisual ? (
        <TemplateVisual content={currentSlide.content} />
      ) : (
        <div className="text-white">
          <p>Template introuvable pour l'ID : "{currentSlide?.templateId}"</p>
          <button onClick={onExit} className="mt-4 border px-4 py-2">Quitter</button>
        </div>
      )}
      <div className="absolute bottom-4 text-gray-500 text-sm">
        {currentIndex + 1} / {slides.length}
      </div>
    </div>
  );
};