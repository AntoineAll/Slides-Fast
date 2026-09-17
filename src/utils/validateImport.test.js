import { describe, it, expect } from 'vitest';
import { validateImportedSlides } from './validateImport';

// Deux modèles réels du projet, pour rester représentatif sans dépendre de tous les templates.
const VALID_TEMPLATE_A = 'titre_image';
const VALID_TEMPLATE_B = 'titre_texte';

describe('validateImportedSlides — formats acceptés', () => {
  it('accepte l\'ancien format : un tableau de slides brut', () => {
    const result = validateImportedSlides([
      { templateId: VALID_TEMPLATE_A, content: { titre: 'A' } },
    ]);
    expect(result.ok).toBe(true);
    expect(result.logoUrl).toBe('');
    expect(result.slides).toHaveLength(1);
  });

  it('accepte le nouveau format enveloppé { slides, logoUrl }', () => {
    const result = validateImportedSlides({
      slides: [{ templateId: VALID_TEMPLATE_A, content: { titre: 'A' } }],
      logoUrl: 'data:image/png;base64,xxx',
    });
    expect(result.ok).toBe(true);
    expect(result.logoUrl).toBe('data:image/png;base64,xxx');
  });

  it('ignore un logoUrl qui n\'est pas une chaîne', () => {
    const result = validateImportedSlides({
      slides: [{ templateId: VALID_TEMPLATE_A }],
      logoUrl: 42,
    });
    expect(result.ok).toBe(true);
    expect(result.logoUrl).toBe('');
  });
});

describe('validateImportedSlides — normalisation des slides', () => {
  it('régénère les id pour éviter toute collision avec l\'existant', () => {
    const result = validateImportedSlides([
      { id: 'original-1', templateId: VALID_TEMPLATE_A },
      { id: 'original-2', templateId: VALID_TEMPLATE_B },
    ]);
    expect(result.ok).toBe(true);
    expect(result.slides.map((s) => s.id)).not.toContain('original-1');
    expect(result.slides.map((s) => s.id)).not.toContain('original-2');
    expect(new Set(result.slides.map((s) => s.id)).size).toBe(2);
  });

  it('applique les valeurs par défaut pour content et notes manquants', () => {
    const result = validateImportedSlides([{ templateId: VALID_TEMPLATE_A }]);
    expect(result.ok).toBe(true);
    expect(result.slides[0].content).toEqual({});
    expect(result.slides[0].notes).toBe('');
  });

  it('conserve les notes existantes si elles sont une chaîne', () => {
    const result = validateImportedSlides([{ templateId: VALID_TEMPLATE_A, notes: 'Mes notes' }]);
    expect(result.slides[0].notes).toBe('Mes notes');
  });
});

describe('validateImportedSlides — rejets', () => {
  it('rejette un tableau vide', () => {
    const result = validateImportedSlides([]);
    expect(result.ok).toBe(false);
    expect(result.errors).toHaveLength(1);
  });

  it('rejette une entrée qui n\'est pas un tableau de slides', () => {
    const result = validateImportedSlides({ notLegit: true });
    expect(result.ok).toBe(false);
  });

  it('rejette une slide qui n\'est pas un objet', () => {
    const result = validateImportedSlides(['pas un objet']);
    expect(result.ok).toBe(false);
    expect(result.errors[0]).toMatch(/format invalide/);
  });

  it('rejette une slide avec un templateId inconnu', () => {
    const result = validateImportedSlides([{ templateId: 'ne_existe_pas' }]);
    expect(result.ok).toBe(false);
    expect(result.errors[0]).toMatch(/modèle/);
  });

  it('rejette une slide dont le content n\'est pas un objet', () => {
    const result = validateImportedSlides([{ templateId: VALID_TEMPLATE_A, content: 'texte' }]);
    expect(result.ok).toBe(false);
    expect(result.errors[0]).toMatch(/content/);
  });

  it('rapporte une erreur par slide invalide, avec son numéro', () => {
    const result = validateImportedSlides([
      { templateId: VALID_TEMPLATE_A },
      { templateId: 'inconnu' },
      { templateId: VALID_TEMPLATE_B },
      { templateId: 'toujours_inconnu' },
    ]);
    expect(result.ok).toBe(false);
    expect(result.errors).toHaveLength(2);
    expect(result.errors[0]).toContain('Slide 2');
    expect(result.errors[1]).toContain('Slide 4');
  });
});
