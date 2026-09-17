const MAX_DIMENSION = 1920; // largement suffisant pour un plein écran Full HD, évite des JSON inutilement lourds avec des photos haute résolution
const RESIZE_QUALITY = 0.92;

const readAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Impossible de lire le fichier.'));
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });

const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Le fichier n'a pas pu être décodé comme une image."));
    img.src = src;
  });

// Calcule les dimensions finales pour qu'aucun côté ne dépasse maxDimension, en appliquant
// le même facteur d'échelle en largeur et en hauteur (jamais de redimensionnement
// indépendant, qui déformerait l'image). scale === 1 signifie "pas de redimensionnement".
export const computeScaledSize = (width, height, maxDimension) => {
  const largestSide = Math.max(width, height);
  if (largestSide <= maxDimension) return { width, height, scale: 1 };

  const scale = maxDimension / largestSide;
  return { width: Math.round(width * scale), height: Math.round(height * scale), scale };
};

// Convertit un fichier image local en data URL prête à être stockée dans le JSON de la
// présentation. Les proportions ne sont jamais déformées : l'éventuel redimensionnement
// applique le même facteur d'échelle en largeur et en hauteur. Le format d'origine (PNG,
// JPEG, WebP...) est conservé, et en dessous de MAX_DIMENSION les octets d'origine sont
// gardés tels quels — aucune recompression, donc aucune perte de qualité superflue.
export const fileToSlideImage = async (file) => {
  if (!file.type.startsWith('image/')) {
    throw new Error("Le fichier sélectionné n'est pas une image.");
  }

  const dataUrl = await readAsDataUrl(file);

  // Vectoriel (SVG) ou potentiellement animé (GIF) : un passage par canvas rastériserait
  // l'un et figerait l'autre sur sa première frame. On les stocke tels quels dans les deux cas.
  if (file.type === 'image/svg+xml' || file.type === 'image/gif') {
    return dataUrl;
  }

  const img = await loadImage(dataUrl);
  const { width, height, scale } = computeScaledSize(img.naturalWidth, img.naturalHeight, MAX_DIMENSION);
  if (scale === 1) return dataUrl;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  canvas.getContext('2d').drawImage(img, 0, 0, width, height);

  return canvas.toDataURL(file.type, RESIZE_QUALITY);
};
