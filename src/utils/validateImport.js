import { templates } from '../templates';
import { DEFAULT_THEME } from '../store/useSlideStore';

const isPlainObject = (value) =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isValidTheme = (value) =>
  isPlainObject(value) &&
  (value.mode === 'default' || value.mode === 'custom') &&
  typeof value.primary === 'string' &&
  typeof value.secondary === 'string';

// title a été ajouté après coup : un fichier exporté avant son introduction n'en a pas, on
// ne veut pas rejeter tout le thème pour autant, juste retomber sur le blanc par défaut.
const normalizeTheme = (theme) => ({
  ...theme,
  title: typeof theme.title === 'string' ? theme.title : DEFAULT_THEME.title,
});

// Valide et normalise une présentation importée depuis un fichier JSON. Accepte deux
// formats : un tableau de slides "brut" (ancien format, toujours supporté pour ne jamais
// casser un fichier déjà sauvegardé) ou un objet { slides, logoUrl, theme }.
// Renvoie soit { ok: true, slides, logoUrl, theme } prêt pour le store, soit
// { ok: false, errors } avec la liste de tout ce qui ne va pas.
export const validateImportedSlides = (data) => {
  const isWrapped = isPlainObject(data) && Array.isArray(data.slides);
  const rawSlides = isWrapped ? data.slides : data;
  const logoUrl = isWrapped && typeof data.logoUrl === 'string' ? data.logoUrl : '';
  const theme = isWrapped && isValidTheme(data.theme) ? normalizeTheme(data.theme) : DEFAULT_THEME;

  if (!Array.isArray(rawSlides) || rawSlides.length === 0) {
    return { ok: false, errors: ["Le fichier doit contenir un tableau de slides non vide."] };
  }

  const errors = [];
  const slides = rawSlides.map((slide, index) => {
    const label = `Slide ${index + 1}`;

    if (!isPlainObject(slide)) {
      errors.push(`${label} : format invalide (un objet est attendu).`);
      return null;
    }

    if (typeof slide.templateId !== 'string' || !templates[slide.templateId]) {
      errors.push(`${label} : modèle "${slide.templateId}" inconnu.`);
      return null;
    }

    if (slide.content !== undefined && !isPlainObject(slide.content)) {
      errors.push(`${label} : le champ "content" doit être un objet.`);
      return null;
    }

    return {
      id: crypto.randomUUID(), // on ignore les id du fichier pour éviter toute collision
      templateId: slide.templateId,
      content: slide.content || {},
      notes: typeof slide.notes === 'string' ? slide.notes : '',
    };
  });

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  return { ok: true, slides, logoUrl, theme };
};
