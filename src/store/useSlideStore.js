import { create } from 'zustand';

export const useSlideStore = create((set) => ({
  slides: [{ id: 1, templateId: 'titre_image', content: { titre: 'Bienvenue', imageUrl: '' } }],
  activeSlideId: 1,

  addSlide: (templateType = 'titre_image') => set((state) => ({
    slides: [...state.slides, { id: Date.now(), templateId: templateType, content: { titre: 'Nouvelle Slide' } }]
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

  updateSlideTemplate: (id, newTemplateId) => set((state) => ({
    slides: state.slides.map((slide) =>
      slide.id === id ? { ...slide, templateId: newTemplateId } : slide
    )
  })),
}));