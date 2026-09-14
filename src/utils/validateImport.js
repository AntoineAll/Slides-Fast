import { templates } from '../templates';

const isPlainObject = (value) =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

// Valide et normalise un tableau de slides importé depuis un fichier JSON.
// Renvoie soit { ok: true, slides } avec des slides prêtes pour le store,
// soit { ok: false, errors } avec la liste de tout ce qui ne va pas.
export const validateImportedSlides = (data) => {
  if (!Array.isArray(data) || data.length === 0) {
    return { ok: false, errors: ["Le fichier doit contenir un tableau de slides non vide."] };
  }

  const errors = [];
  const slides = data.map((slide, index) => {
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

  return { ok: true, slides };
};
