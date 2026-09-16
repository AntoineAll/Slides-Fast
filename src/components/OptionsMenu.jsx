import { useEffect, useRef, useState } from 'react';
import { exportToPdf } from '../utils/exportPdf';

// Menu déroulant pour les actions secondaires sur la présentation entière. Un seul point
// d'entrée dans la barre d'outils, pensé pour accueillir de futures options (ex: traduction
// automatique) sans avoir à réorganiser le header à chaque ajout.
export const OptionsMenu = ({ slides }) => {
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
        </div>
      )}
    </div>
  );
};
