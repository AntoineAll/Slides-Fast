import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useSlideStore } from './useSlideStore';

const makeInitialSlides = () => [
  { id: 'slide-1', templateId: 'titre_image', content: { titre: 'Un' }, notes: '' },
  { id: 'slide-2', templateId: 'titre_texte', content: { titre: 'Deux' }, notes: '' },
];

// Remet le store dans un état connu avant chaque test. On passe par setSlides()
// (plutôt que setState(..., true)) pour aussi réinitialiser le `lastEdit` interne à la
// fusion d'historique, sans écraser les actions du store.
const resetStore = () => {
  useSlideStore.getState().setSlides(makeInitialSlides());
  useSlideStore.setState({ activeSlideId: 'slide-1', past: [], future: [], logoUrl: '' });
};

beforeEach(() => {
  resetStore();
});

describe('addSlide', () => {
  it('ajoute une slide avec un contenu par défaut et empile l\'historique', () => {
    const before = useSlideStore.getState().slides.length;
    useSlideStore.getState().addSlide('titre_image');
    const state = useSlideStore.getState();
    expect(state.slides).toHaveLength(before + 1);
    expect(state.slides.at(-1)).toMatchObject({ templateId: 'titre_image', content: { titre: 'Nouvelle Slide' } });
    expect(state.past).toHaveLength(1);
    expect(state.future).toHaveLength(0);
  });
});

describe('duplicateSlide', () => {
  it('insère une copie juste après l\'originale avec un nouvel id', () => {
    useSlideStore.getState().duplicateSlide('slide-1');
    const { slides } = useSlideStore.getState();
    expect(slides).toHaveLength(3);
    expect(slides[0].id).toBe('slide-1');
    expect(slides[1].id).not.toBe('slide-1');
    expect(slides[1].templateId).toBe('titre_image');
    expect(slides[1].content).toEqual(slides[0].content);
  });

  it('rend la copie active', () => {
    useSlideStore.getState().duplicateSlide('slide-1');
    const { slides, activeSlideId } = useSlideStore.getState();
    expect(activeSlideId).toBe(slides[1].id);
  });

  it('clone le contenu en profondeur (modifier la copie ne touche pas l\'originale)', () => {
    useSlideStore.getState().duplicateSlide('slide-1');
    const { slides } = useSlideStore.getState();
    const duplicateId = slides[1].id;

    useSlideStore.getState().updateSlideContent(duplicateId, { titre: 'Modifié' });

    const after = useSlideStore.getState().slides;
    expect(after.find((s) => s.id === 'slide-1').content.titre).toBe('Un');
    expect(after.find((s) => s.id === duplicateId).content.titre).toBe('Modifié');
  });

  it('ne fait rien si l\'id n\'existe pas', () => {
    const before = useSlideStore.getState();
    useSlideStore.getState().duplicateSlide('inexistant');
    const after = useSlideStore.getState();
    expect(after.slides).toEqual(before.slides);
    expect(after.past).toEqual(before.past);
  });
});

describe('removeSlide', () => {
  it('retire la slide demandée', () => {
    useSlideStore.getState().removeSlide('slide-2');
    expect(useSlideStore.getState().slides.map((s) => s.id)).toEqual(['slide-1']);
  });

  it('bascule sur la première slide restante si la slide active est supprimée', () => {
    useSlideStore.setState({ activeSlideId: 'slide-1' });
    useSlideStore.getState().removeSlide('slide-1');
    expect(useSlideStore.getState().activeSlideId).toBe('slide-2');
  });

  it('laisse la slide active inchangée si une autre slide est supprimée', () => {
    useSlideStore.setState({ activeSlideId: 'slide-2' });
    useSlideStore.getState().removeSlide('slide-1');
    expect(useSlideStore.getState().activeSlideId).toBe('slide-2');
  });

  it('passe activeSlideId à null quand la dernière slide est supprimée', () => {
    useSlideStore.getState().removeSlide('slide-1');
    useSlideStore.getState().removeSlide('slide-2');
    expect(useSlideStore.getState().slides).toHaveLength(0);
    expect(useSlideStore.getState().activeSlideId).toBeNull();
  });
});

describe('updateSlideContent — fusion d\'historique', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(0);
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('fusionne deux frappes rapprochées sur le même champ en une seule entrée d\'historique', () => {
    useSlideStore.getState().updateSlideContent('slide-1', { titre: 'U' });
    expect(useSlideStore.getState().past).toHaveLength(1);

    vi.advanceTimersByTime(200);
    useSlideStore.getState().updateSlideContent('slide-1', { titre: 'Un' });

    expect(useSlideStore.getState().past).toHaveLength(1);
    expect(useSlideStore.getState().slides[0].content.titre).toBe('Un');
  });

  it('crée une nouvelle entrée d\'historique après la fenêtre de fusion', () => {
    useSlideStore.getState().updateSlideContent('slide-1', { titre: 'U' });
    vi.advanceTimersByTime(801);
    useSlideStore.getState().updateSlideContent('slide-1', { titre: 'Un' });

    expect(useSlideStore.getState().past).toHaveLength(2);
  });

  it('ne fusionne pas des frappes rapprochées sur deux slides différentes', () => {
    useSlideStore.getState().updateSlideContent('slide-1', { titre: 'U' });
    vi.advanceTimersByTime(100);
    useSlideStore.getState().updateSlideContent('slide-2', { titre: 'D' });

    expect(useSlideStore.getState().past).toHaveLength(2);
  });

  it('merge par contenu et par notes sont indépendants même sur la même slide', () => {
    useSlideStore.getState().updateSlideContent('slide-1', { titre: 'U' });
    vi.advanceTimersByTime(100);
    useSlideStore.getState().updateSlideNotes('slide-1', 'note');

    expect(useSlideStore.getState().past).toHaveLength(2);
  });
});

describe('undo / redo', () => {
  it('undo restaure l\'état précédent et alimente future', () => {
    useSlideStore.getState().removeSlide('slide-2');
    expect(useSlideStore.getState().slides).toHaveLength(1);

    useSlideStore.getState().undo();

    const state = useSlideStore.getState();
    expect(state.slides).toHaveLength(2);
    expect(state.future).toHaveLength(1);
  });

  it('redo ré-applique l\'état annulé', () => {
    useSlideStore.getState().removeSlide('slide-2');
    useSlideStore.getState().undo();
    useSlideStore.getState().redo();

    expect(useSlideStore.getState().slides).toHaveLength(1);
    expect(useSlideStore.getState().future).toHaveLength(0);
  });

  it('undo est un no-op si l\'historique est vide', () => {
    const before = useSlideStore.getState();
    useSlideStore.getState().undo();
    expect(useSlideStore.getState().slides).toEqual(before.slides);
  });

  it('redo est un no-op si aucun redo n\'est disponible', () => {
    const before = useSlideStore.getState();
    useSlideStore.getState().redo();
    expect(useSlideStore.getState().slides).toEqual(before.slides);
  });

  it('une nouvelle action après un undo repart de l\'état restauré (future perdu)', () => {
    useSlideStore.getState().removeSlide('slide-2');
    useSlideStore.getState().undo();
    useSlideStore.getState().addSlide('titre_image');

    expect(useSlideStore.getState().future).toHaveLength(0);
    expect(useSlideStore.getState().slides).toHaveLength(3);
  });
});

describe('historique — limite de taille', () => {
  it('ne garde que les 50 dernières entrées de past', () => {
    for (let i = 0; i < 55; i += 1) {
      useSlideStore.getState().addSlide('titre_image');
    }
    expect(useSlideStore.getState().past).toHaveLength(50);
  });
});

describe('logoUrl', () => {
  it('setLogoUrl met à jour le logo sans toucher à l\'historique annuler/rétablir', () => {
    useSlideStore.getState().setLogoUrl('data:image/png;base64,xxx');
    const state = useSlideStore.getState();
    expect(state.logoUrl).toBe('data:image/png;base64,xxx');
    expect(state.past).toHaveLength(0);
  });
});
