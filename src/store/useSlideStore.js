import { create } from 'zustand';

export const useSlideStore = create((set) => ({
  slides: [{ id: 1, template: 'titre_image', content: { titre: 'Bienvenue', imageUrl: '' } }],
  activeSlideId: 1,

  addSlide: (templateType = 'titre_image') => set((state) => ({
    slides: [...state.slides, { id: Date.now(), template: templateType, content: { titre: 'Nouvelle Slide', imageUrl: '' } }]
  })),

  removeSlide: (id) => set((state) => {
    const newSlides = state.slides.filter(s => s.id !== id);
    return {
      slides: newSlides,
      activeSlideId: state.activeSlideId === id 
        ? (newSlides.length > 0 ? newSlides[0].id : null) 
        : state.activeSlideId
    };
  }),

  setSlides: (newSlides) => set({ slides: newSlides }),
  
  setActiveSlideId: (id) => set({ activeSlideId: id }),

  updateSlideContent: (id, newContent) => set((state) => ({
    slides: state.slides.map((slide) =>
      slide.id === id ? { ...slide, content: { ...slide.content, ...newContent } } : slide
    )
  })),

  // Ajout de la fonction pour modifier le template d'une slide
  updateSlideTemplate: (id, newTemplate) => set((state) => ({
    slides: state.slides.map((slide) =>
      slide.id === id ? { ...slide, template: newTemplate } : slide
    )
  })),
}));