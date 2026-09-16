import { useEffect, useState } from 'react';

// Calcule le facteur d'échelle à appliquer à un contenu de taille fixe (contentWidth x
// contentHeight, en px) pour qu'il tienne entièrement dans la fenêtre actuelle, quelle
// que soit sa taille (petit écran de laptop, fenêtre non maximisée, second écran d'une
// autre résolution...). Sans ça, un contenu plus grand que le viewport se retrouve
// simplement rogné en haut/bas par les bords de la fenêtre — sans barre de défilement
// pour le signaler, puisqu'il est en position fixed.
export const useViewportFitScale = (contentWidth, contentHeight, { maxScale = 1.5, margin = 0.92 } = {}) => {
  const computeScale = () => {
    if (typeof window === 'undefined') return maxScale;
    const scaleToFitWidth = (window.innerWidth * margin) / contentWidth;
    const scaleToFitHeight = (window.innerHeight * margin) / contentHeight;
    return Math.min(scaleToFitWidth, scaleToFitHeight, maxScale);
  };

  const [scale, setScale] = useState(computeScale);

  useEffect(() => {
    const handleResize = () => setScale(computeScale());
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentWidth, contentHeight, maxScale, margin]);

  return scale;
};
