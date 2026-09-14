
const ACCENT_CLASSES = {
  blue: 'text-blue-400',
  cyan: 'text-cyan-400',
};

const SURFACE_CLASSES = {
  gray: 'bg-gray-800 border-gray-700',
  slate: 'bg-slate-900 border-slate-800',
};

// Composant de notes partagé par tous les templates (utilisé dans le PresenterMode).
// Chaque template ne varie que par sa couleur d'accent / sa surface, d'où les deux props.
export const GenericNotes = ({ content, accent = 'blue', surface = 'gray' }) => (
  <div className="space-y-4">
    <h3 className={`text-lg font-bold ${ACCENT_CLASSES[accent] || ACCENT_CLASSES.blue}`}>Notes</h3>
    <div className={`p-3 rounded border min-h-[100px] ${SURFACE_CLASSES[surface] || SURFACE_CLASSES.gray}`}>
      <p className="text-gray-300 text-sm whitespace-pre-line">
        {content?.notes || 'Aucune note spécifique ajoutée pour cette slide.'}
      </p>
    </div>
  </div>
);
