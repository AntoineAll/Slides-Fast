import { GenericForm } from './GenericForm';
import { GenericNotes } from './GenericNotes';

// Rendu visuel de la slide (Focus / Spotlight)
export const FocusVisual = ({ content }) => {
  return (
    <div className="w-[850px] h-[478px] bg-slate-950 rounded-2xl border-2 border-slate-700 shadow-2xl flex relative overflow-hidden flex-shrink-0 box-border">
      {/* Côté gauche : Zone visuelle forte */}
      <div className="w-1/3 bg-blue-600 flex items-center justify-center p-8 relative">
        <div className="text-8xl">{content?.icone || '💡'}</div>
      </div>

      {/* Côté droit : Contenu textuel */}
      <div className="w-2/3 p-12 flex flex-col justify-center bg-gradient-to-r from-slate-950 to-slate-900">
        <h2 className="text-4xl font-extrabold text-white mb-6 leading-tight">
          {content?.titre || 'Le sujet principal'}
        </h2>
        <p className="text-slate-300 text-lg leading-relaxed border-l-4 border-blue-600 pl-6">
          {content?.desc || 'Présentez ici l\'idée maîtresse de votre présentation. Ce template est conçu pour isoler une information cruciale et la rendre inoubliable.'}
        </p>
      </div>
    </div>
  );
};

const fields = [
  { key: 'icone', type: 'emojiPicker', label: 'Choisir un icône', defaultValue: '💡' },
  { key: 'titre', type: 'text', label: 'Titre', placeholder: 'Ex: Stratégie Clé' },
  { key: 'desc', type: 'textarea', label: 'Description', placeholder: 'Détails importants...', rows: 4 },
];

export const FocusForm = (props) => <GenericForm fields={fields} {...props} />;
export const FocusNotes = (props) => <GenericNotes {...props} />;
