import { useEffect, useState } from 'react';

// Comme useViewportFitScale, mais mesure un conteneur DOM précis plutôt que la fenêtre
// entière : pour un aperçu qui ne remplit pas tout l'écran (ex: le panneau "Slide Actuelle"
// du mode présentateur, qui partage l'espace avec les notes et l'aperçu de la slide
// suivante). Sans ça, une boîte plus petite que le contenu fixe (850x478) le coupe
// silencieusement via overflow-hidden au lieu de le réduire.
export const useContainerFitScale = (containerRef, contentWidth, contentHeight, { maxScale = 1, margin = 0.94 } = {}) => {
  const [scale, setScale] = useState(maxScale);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const computeScale = () => {
      const { width, height } = el.getBoundingClientRect();
      if (!width || !height) return;
      const scaleToFitWidth = (width * margin) / contentWidth;
      const scaleToFitHeight = (height * margin) / contentHeight;
      setScale(Math.min(scaleToFitWidth, scaleToFitHeight, maxScale));
    };

    computeScale();
    const observer = new ResizeObserver(computeScale);
    observer.observe(el);
    return () => observer.disconnect();
  }, [containerRef, contentWidth, contentHeight, maxScale, margin]);

  return scale;
};
