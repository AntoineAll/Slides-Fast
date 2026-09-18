import { useEffect, useRef, useState } from 'react';
import { exportToPdf } from '../utils/exportPdf';
import { fileToSlideImage } from '../utils/imageFile';
import { DEFAULT_THEME } from '../store/useSlideStore';

// Menu déroulant pour les actions secondaires sur la présentation entière. Un seul point
// d'entrée dans la barre d'outils, pensé pour accueillir de futures options (ex: traduction
// automatique) sans avoir à réorganiser le header à chaque ajout.
export const OptionsMenu = ({ slides, logoUrl, onLogoChange, theme, onThemeChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleExportPdf = async () => {
    setIsOpen(false);
    setIsExporting(true);
    try {
      await exportToPdf(slides);
    } catch (err) {
      console.error("Échec de l'export PDF :", err);
      alert("L'export PDF a échoué. Vérifiez la console pour plus de détails.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleLogoFile = async (e) => {
    const file = e.target.files[0];
    e.target.value = ''; // permet de réimporter le même fichier après une erreur
    if (!file) return;
    setIsOpen(false);
    try {
      onLogoChange(await fileToSlideImage(file));
    } catch (err) {
      alert(err.message);
    }
  };

  // On garde toujours primary/secondary en mémoire même en mode 'default', pour que
  // repasser en 'personnalisé' retrouve les dernières couleurs choisies plutôt que de
  // repartir des couleurs par défaut.
  const setThemeMode = (mode) => onThemeChange({ ...theme, mode });
  const setThemeColor = (key, value) => onThemeChange({ ...theme, mode: 'custom', [key]: value });
  const resetThemeColors = () => onThemeChange({ ...DEFAULT_THEME, mode: 'custom' });

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen((o) => !o)}
        disabled={isExporting}
        title="Autres options"
        className="bg-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isExporting ? '⏳ Export…' : '⋯ Options'}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-56 bg-gray-800 border border-gray-700 rounded-lg shadow-xl overflow-hidden z-20">
          <button
            onClick={handleExportPdf}
            className="w-full text-left px-4 py-2.5 text-sm text-gray-200 hover:bg-gray-700 transition"
          >
            📄 Exporter en PDF
          </button>

          <label className="block w-full text-left px-4 py-2.5 text-sm text-gray-200 hover:bg-gray-700 transition cursor-pointer">
            🖼️ {logoUrl ? 'Changer le logo' : 'Ajouter un logo'}
            <input type="file" accept="image/*" className="hidden" onChange={handleLogoFile} />
          </label>

          {logoUrl && (
            <button
              onClick={() => { setIsOpen(false); onLogoChange(''); }}
              className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-gray-700 transition"
            >
              🗑️ Retirer le logo
            </button>
          )}

          <div className="border-t border-gray-700 px-4 py-3">
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-2">
              🎨 Thème de couleur
            </p>
            <div className="flex gap-1.5 mb-2.5">
              <button
                onClick={() => setThemeMode('default')}
                className={`flex-1 text-xs px-2 py-1.5 rounded transition ${
                  theme.mode === 'default' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Par défaut
              </button>
              <button
                onClick={() => setThemeMode('custom')}
                className={`flex-1 text-xs px-2 py-1.5 rounded transition ${
                  theme.mode === 'custom' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Personnalisé
              </button>
            </div>

            {theme.mode === 'custom' && (
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-1.5 text-xs text-gray-300 cursor-pointer">
                    <input
                      type="color"
                      value={theme.primary}
                      onChange={(e) => setThemeColor('primary', e.target.value)}
                      className="w-6 h-6 rounded border border-gray-600 bg-transparent cursor-pointer"
                      aria-label="Couleur principale"
                    />
                    Principale
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-gray-300 cursor-pointer">
                    <input
                      type="color"
                      value={theme.secondary}
                      onChange={(e) => setThemeColor('secondary', e.target.value)}
                      className="w-6 h-6 rounded border border-gray-600 bg-transparent cursor-pointer"
                      aria-label="Couleur secondaire"
                    />
                    Secondaire
                  </label>
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-1.5 text-xs text-gray-300 cursor-pointer">
                    <input
                      type="color"
                      value={theme.title}
                      onChange={(e) => setThemeColor('title', e.target.value)}
                      className="w-6 h-6 rounded border border-gray-600 bg-transparent cursor-pointer"
                      aria-label="Couleur du titre"
                    />
                    Titre
                  </label>
                  <button
                    onClick={resetThemeColors}
                    title="Réinitialiser aux couleurs par défaut"
                    aria-label="Réinitialiser les couleurs du thème"
                    className="ml-auto text-gray-500 hover:text-white text-xs"
                  >
                    ↺ Réinitialiser
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
