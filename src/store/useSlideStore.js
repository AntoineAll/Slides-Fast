import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useSlideStore = create(
  persist(
    (set) => ({
      // Ajout de notes: '' par défaut
      slides: [{ id: 1, templateId: 'titre_image', content: { titre: 'Bienvenue', imageUrl: '' }, notes: '' }],
      activeSlideId: 1,

      addSlide: (templateType = 'titre_image') => set((state) => ({
        slides: [...state.slides, { 
          id: Date.now(), 
          templateId: templateType, 
          content: { titre: 'Nouvelle Slide' },
          notes: '' // Initialisation des notes
        }]
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

      // Nouvelle fonction pour mettre à jour les notes
      updateSlideNotes: (id, newNotes) => set((state) => ({
        slides: state.slides.map((slide) =>
          slide.id === id ? { ...slide, notes: newNotes } : slide
        )
      })),

      updateSlideTemplate: (id, newTemplateId) => set((state) => ({
        slides: state.slides.map((slide) =>
          slide.id === id ? { ...slide, templateId: newTemplateId } : slide
        )
      })),
    }),
    {
      name: 'slides-storage',
    }
  )
);