import React, { useState, useEffect } from 'react';
import { useSlideStore } from '../store/useSlideStore';
import { templates } from '../templates';

const channel = new BroadcastChannel('slide_sync');

export const PresenterMode = ({ onExit }) => {
  const { slides } = useSlideStore();
  const [currentIndex, setCurrentIndex] = useState(0);

  const changeSlide = (newIndex) => {
    setCurrentIndex(newIndex);
    channel.postMessage({ type: 'GOTO', index: newIndex });
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' && currentIndex < slides.length - 1) changeSlide(currentIndex + 1);
      else if (e.key === 'ArrowLeft' && currentIndex > 0) changeSlide(currentIndex - 1);
      else if (e.key === 'Escape') onExit();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, slides.length, onExit]);

  const currentSlide = slides[currentIndex];
  const nextSlide = slides[currentIndex + 1];

  return (
    <div className="fixed inset-0 bg-gray-950 text-white p-6 grid grid-cols-3 gap-6">
      <div className="col-span-2 flex flex-col gap-4">
        <h2 className="text-xl font-bold">Slide Actuelle</h2>
        <div className="flex-1 bg-black rounded-xl overflow-hidden border border-gray-700 flex items-center justify-center">
           {templates[currentSlide?.templateId]?.Visual({ content: currentSlide.content })}
        </div>
        <div className="bg-gray-900 p-6 rounded-xl border border-gray-700 h-48">
          <h3 className="text-gray-400 mb-2 font-semibold">Notes du présentateur</h3>
          <p className="text-lg">{currentSlide?.notes || "Aucune note."}</p>
        </div>
      </div>
      <div className="col-span-1 flex flex-col gap-6">
        <div>
          <h2 className="text-xl font-bold mb-4">Slide Suivante</h2>
          <div className="w-full aspect-video bg-black rounded-lg border border-gray-700 overflow-hidden relative">
            {nextSlide ? (
              <div className="absolute top-0 left-0 origin-top-left" style={{ transform: 'scale(0.353)', width: '850px', height: '478px' }}>
                {templates[nextSlide.templateId]?.Visual({ content: nextSlide.content })}
              </div>
            ) : <div className="flex items-center justify-center h-full text-gray-600">Fin</div>}
          </div>
        </div>
        <button onClick={onExit} className="mt-auto bg-red-600 py-3 rounded-lg hover:bg-red-500">Quitter</button>
      </div>
    </div>
  );
};