import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const HISTORY_LIMIT = 50;
const MERGE_WINDOW_MS = 800; // frappes rapprochées sur le même champ = une seule entrée d'historique

export const useSlideStore = create(
  persist(
    (set) => {
      // Suivi de la dernière édition "continue" (ex: frappe dans un champ texte),
      // pour regrouper les frappes rapprochées en une seule entrée d'historique.
      let lastEdit = null; // { key, timestamp }

      const snapshot = (state) => ({
        slides: state.slides,
        activeSlideId: state.activeSlideId,
      });

      // Renvoie le patch { past, future } à fusionner dans le prochain set(),
      // en empilant l'état courant avant de le modifier.
      const pushHistory = (state) => ({
        past: [...state.past, snapshot(state)].slice(-HISTORY_LIMIT),
        future: [],
      });

      return {
        // Ajout de notes: '' par défaut
        slides: [{ id: 1, templateId: 'titre_image', content: { titre: 'Bienvenue', imageUrl: '' }, notes: '' }],
        activeSlideId: 1,
        past: [],
        future: [],

        addSlide: (templateType = 'titre_image') => {
          lastEdit = null;
          set((state) => ({
            ...pushHistory(state),
            slides: [...state.slides, {
              id: crypto.randomUUID(),
              templateId: templateType,
              content: { titre: 'Nouvelle Slide' },
              notes: ''
            }]
          }));
        },

        // Insère une copie juste après l'originale et la rend active, pour le geste
        // "dupliquer puis ajuster" typique d'un éditeur de slides.
        duplicateSlide: (id) => {
          lastEdit = null;
          set((state) => {
            const index = state.slides.findIndex((s) => s.id === id);
            if (index === -1) return state;

            const duplicate = {
              ...state.slides[index],
              id: crypto.randomUUID(),
              // Clone profond : sans ça, la copie partagerait le même objet `content` que
              // l'originale, et modifier l'une modifierait l'autre par référence.
              content: JSON.parse(JSON.stringify(state.slides[index].content || {})),
            };
            const newSlides = [...state.slides];
            newSlides.splice(index + 1, 0, duplicate);

            return {
              ...pushHistory(state),
              slides: newSlides,
              activeSlideId: duplicate.id,
            };
          });
        },

        removeSlide: (id) => {
          lastEdit = null;
          set((state) => {
            const newSlides = state.slides.filter(s => s.id !== id);
            return {
              ...pushHistory(state),
              slides: newSlides,
              activeSlideId: state.activeSlideId === id
                ? (newSlides.length > 0 ? newSlides[0].id : null)
                : state.activeSlideId
            };
          });
        },

        setSlides: (newSlides) => {
          lastEdit = null;
          set((state) => ({
            ...pushHistory(state),
            slides: newSlides
          }));
        },

        setActiveSlideId: (id) => set({ activeSlideId: id }),

        updateSlideContent: (id, newContent) => {
          const editKey = `content:${id}`;
          const now = Date.now();
          set((state) => {
            const shouldMerge = lastEdit && lastEdit.key === editKey && now - lastEdit.timestamp < MERGE_WINDOW_MS;
            return {
              ...(shouldMerge ? {} : pushHistory(state)),
              slides: state.slides.map((slide) =>
                slide.id === id ? { ...slide, content: { ...slide.content, ...newContent } } : slide
              )
            };
          });
          lastEdit = { key: editKey, timestamp: now };
        },

        // Nouvelle fonction pour mettre à jour les notes
        updateSlideNotes: (id, newNotes) => {
          const editKey = `notes:${id}`;
          const now = Date.now();
          set((state) => {
            const shouldMerge = lastEdit && lastEdit.key === editKey && now - lastEdit.timestamp < MERGE_WINDOW_MS;
            return {
              ...(shouldMerge ? {} : pushHistory(state)),
              slides: state.slides.map((slide) =>
                slide.id === id ? { ...slide, notes: newNotes } : slide
              )
            };
          });
          lastEdit = { key: editKey, timestamp: now };
        },

        updateSlideTemplate: (id, newTemplateId) => {
          lastEdit = null;
          set((state) => ({
            ...pushHistory(state),
            slides: state.slides.map((slide) =>
              slide.id === id ? { ...slide, templateId: newTemplateId } : slide
            )
          }));
        },

        undo: () => {
          lastEdit = null;
          set((state) => {
            if (state.past.length === 0) return state;
            const previous = state.past[state.past.length - 1];
            return {
              past: state.past.slice(0, -1),
              future: [snapshot(state), ...state.future].slice(0, HISTORY_LIMIT),
              slides: previous.slides,
              activeSlideId: previous.activeSlideId,
            };
          });
        },

        redo: () => {
          lastEdit = null;
          set((state) => {
            if (state.future.length === 0) return state;
            const [next, ...rest] = state.future;
            return {
              past: [...state.past, snapshot(state)].slice(-HISTORY_LIMIT),
              future: rest,
              slides: next.slides,
              activeSlideId: next.activeSlideId,
            };
          });
        },
      };
    },
    {
      name: 'slides-storage',
      // L'historique d'undo/redo ne doit pas être persisté ni gonfler le localStorage
      partialize: (state) => ({ slides: state.slides, activeSlideId: state.activeSlideId }),
    }
  )
);
