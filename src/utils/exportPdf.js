import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { templates } from '../templates';

const SLIDE_WIDTH = 850;
const SLIDE_HEIGHT = 478; // 850 * 9/16, le même format que l'aperçu de l'éditeur
const CAPTURE_SCALE = 2; // rendu à 2x pour un PDF net y compris à l'impression, pas juste à l'écran

// Attend que toutes les images d'un conteneur soient chargées (ou en erreur), pour ne
// jamais capturer une slide avec une image encore blanche.
const waitForImages = (container) => {
  const images = Array.from(container.querySelectorAll('img'));
  return Promise.all(
    images.map((img) =>
      img.complete
        ? Promise.resolve()
        : new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve;
          })
    )
  );
};

// Exporte la présentation en PDF, une page par slide, en capturant le même rendu Visual
// que l'aperçu de l'éditeur — donc toujours fidèle à ce que l'utilisateur voit. Tout se
// passe côté navigateur : aucune donnée n'est envoyée à un serveur, dans l'esprit
// "souveraineté des données" du reste de l'app.
//
// Note : une image importée depuis le disque (data URL) s'exporte toujours correctement ;
// une image référencée par une URL externe peut échouer si le serveur qui l'héberge ne
// renvoie pas d'en-têtes CORS (limitation du navigateur, pas de contournement possible ici).
export const exportToPdf = async (slides, fileName = 'SlidesFast.pdf') => {
  if (!slides || slides.length === 0) return;

  // Chargées à la demande : ce sont de grosses dépendances (~370 Ko) qui ne servent qu'à
  // l'export, inutile d'alourdir le chargement initial de l'app pour tout le monde.
  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
    import('html2canvas-pro'),
    import('jspdf'),
  ]);

  // Conteneur hors-écran mais bien présent dans le DOM (condition pour que html2canvas
  // puisse le capturer) : jamais visible pour l'utilisateur, capturé slide par slide puis nettoyé.
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.top = '0';
  container.style.left = '-99999px';
  document.body.appendChild(container);
  const root = createRoot(container);

  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'px',
    format: [SLIDE_WIDTH, SLIDE_HEIGHT],
    hotfixes: ['px_scaling'],
  });

  try {
    for (let i = 0; i < slides.length; i++) {
      const slide = slides[i];
      const Visual = templates[slide.templateId]?.Visual;
      if (!Visual) continue;

      // render() est asynchrone (React 18+) : on attend le prochain paint avant de lire le DOM.
      await new Promise((resolve) => {
        root.render(createElement(Visual, { content: slide.content }));
        requestAnimationFrame(() => requestAnimationFrame(resolve));
      });
      await waitForImages(container);

      const canvas = await html2canvas(container.firstChild, {
        scale: CAPTURE_SCALE,
        useCORS: true,
        backgroundColor: null,
      });

      if (i > 0) doc.addPage([SLIDE_WIDTH, SLIDE_HEIGHT], 'landscape');
      doc.addImage(canvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, SLIDE_WIDTH, SLIDE_HEIGHT);
    }

    doc.save(fileName);
  } finally {
    root.unmount();
    document.body.removeChild(container);
  }
};
