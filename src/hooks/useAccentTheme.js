import { useEffect } from 'react';
import { DEFAULT_THEME } from '../store/useSlideStore';

// Applique la couleur d'accent de la présentation à tout le document via des variables CSS
// (--accent-primary / --accent-secondary / --accent-title), lues par les modèles de slides
// en arbitrary value Tailwind (ex: bg-[var(--accent-primary)]). Passer par une variable
// globale plutôt que par des props évite de faire transiter le thème dans chaque composant
// qui affiche une Visual (éditeur, présentateur, vue d'ensemble, sélecteur de modèles,
// export PDF...), et permet un aperçu live instantané puisque le CSS se met à jour sans
// re-render React.
export const useAccentTheme = (theme) => {
  useEffect(() => {
    const { primary, secondary, title } = theme?.mode === 'custom' ? theme : DEFAULT_THEME;
    document.documentElement.style.setProperty('--accent-primary', primary);
    document.documentElement.style.setProperty('--accent-secondary', secondary);
    document.documentElement.style.setProperty('--accent-title', title || DEFAULT_THEME.title);
  }, [theme]);
};
