import { useEffect, useRef, useState } from 'react';
import { exportToPdf } from '../utils/exportPdf';
import { fileToSlideImage } from '../utils/imageFile';

// Menu déroulant pour les actions secondaires sur la présentation entière. Un seul point
// d'entrée dans la barre d'outils, pensé pour accueillir de futures options (ex: traduction
// automatique) sans avoir à réorganiser le header à chaque ajout.
export const OptionsMenu = ({ slides, logoUrl, onLogoChange }) => {
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
        </div>
      )}
    </div>
  );
};
