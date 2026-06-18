import { create } from 'zustand';

export const useSlideStore = create((set) => ({
  slides: [{ id: 1, template: 'titre_image', content: { titre: 'Bienvenue', image: '' } }],
  activeSlideId: 1,

  // Action pour ajouter une slide
  addSlide: (templateType = 'titre_image') => set((state) => ({
    slides: [...state.slides, { id: Date.now(), template: templateType, content: {} }]
  })),

  // Action pour supprimer une slide
  removeSlide: (id) => set((state) => ({
    slides: state.slides.filter(s => s.id !== id)
  })),

  // Action pour réorganiser en faisant du Drag & Drop des slides 
  setSlides: (newSlides) => set({ slides: newSlides }),
  
  // Action pour sélectionner la slide active
  setActiveSlideId: (id) => set({ activeSlideId: id }),

  // Action pour mettre à jour le contenu d'une slide spécifique
  updateSlideContent: (id, newContent) => set((state) => ({
    slides: state.slides.map((slide) =>
      slide.id === id ? { ...slide, content: { ...slide.content, ...newContent } } : slide
    )
  })),
}));