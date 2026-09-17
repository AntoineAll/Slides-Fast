import { useState } from 'react';
import { fileToSlideImage } from '../utils/imageFile';

// Moteur de formulaire déclaratif : chaque template décrit ses champs avec un simple
// tableau de descripteurs (voir les types ci-dessous) au lieu de dupliquer le JSX des
// inputs. Les notes du présentateur sont ajoutées automatiquement à la fin, tous les
// templates en ayant une, identique.
//
// Types de champs supportés :
// - text / textarea / number / color : champ scalaire classique
// - emojiPicker  : sélecteur rapide d'émojis + saisie libre
// - toggle       : groupe de boutons pour un choix parmi options[]
// - list         : tableau de chaînes, avec ajout/suppression entre min et max
// - objectList   : tableau d'objets dont les champs sont eux-mêmes décrits par `fields`
//                  (countMode: 'fixed' | 'addRemove' | 'select')
// - twoColumnList (top-level uniquement) : deux groupes {titre, items[]} côte à côte
// - image        : import depuis le disque (converti en data URL locale, redimensionné
//                  sans déformation si trop grand) avec une URL externe en secours

const inputClass = 'w-full bg-gray-800 border border-gray-700 text-white rounded-lg p-3 focus:outline-none focus:border-blue-500';
const smallInputClass = 'w-full bg-gray-800 border border-gray-700 text-white text-xs rounded p-2 focus:outline-none focus:border-blue-500';
const labelClass = 'block text-sm font-medium text-gray-300 mb-1';
const DEFAULT_EMOJIS = ['🚀', '💡', '💎', '🤝', '⚡', '🌍', '📈', '🎯', '⚙️', '🛡️', '🏆', '⭐'];

const TextField = ({ field, value, onChange }) => (
  <div>
    {field.label && <label className={labelClass}>{field.label}</label>}
    <input
      type="text"
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={field.placeholder}
      className={field.small ? smallInputClass : inputClass}
    />
  </div>
);

const TextareaField = ({ field, value, onChange }) => (
  <div>
    {field.label && <label className={labelClass}>{field.label}</label>}
    <textarea
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={field.placeholder}
      rows={field.rows || 3}
      className={`${field.small ? smallInputClass : inputClass} resize-none`}
    />
  </div>
);

const NumberField = ({ field, value, onChange }) => (
  <div>
    {field.label && <label className={labelClass}>{field.label}</label>}
    <input
      type="number"
      value={value ?? ''}
      onChange={(e) => onChange(Number(e.target.value))}
      placeholder={field.placeholder}
      className={field.small ? smallInputClass : inputClass}
    />
  </div>
);

const ColorField = ({ field, value, onChange }) => (
  <div className="flex items-center gap-2 justify-end">
    {field.label && <span className="text-[10px] text-gray-500">{field.label}</span>}
    <input
      type="color"
      value={value || field.defaultValue || '#3B82F6'}
      onChange={(e) => onChange(e.target.value)}
      className="w-8 h-8 rounded border-0 cursor-pointer bg-transparent"
    />
  </div>
);

// Une image "value" peut être soit une data URL issue d'un import local, soit une URL externe
// collée par l'utilisateur. On ne préremplit le champ URL qu'avec le second cas : réafficher
// un data URL (potentiellement des mégaoctets de base64) dans un input texte n'aurait aucun sens.
const isDataUrl = (value) => typeof value === 'string' && value.startsWith('data:');

const ImageField = ({ field, value, onChange }) => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFile = async (e) => {
    const file = e.target.files[0];
    e.target.value = ''; // permet de réimporter le même fichier après une erreur
    if (!file) return;

    setError(null);
    setIsLoading(true);
    try {
      onChange(await fileToSlideImage(file));
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {field.label && <label className={labelClass}>{field.label}</label>}

      {value && (
        <div className="relative mb-2 rounded-lg overflow-hidden border border-gray-700 bg-gray-950">
          <img src={value} alt="Aperçu" className="w-full max-h-40 object-contain" />
          <button
            type="button"
            onClick={() => onChange('')}
            title="Retirer l'image"
            className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-gray-900/80 text-gray-300 hover:bg-red-900/80 hover:text-white transition"
          >
            ✕
          </button>
        </div>
      )}

      <label className={`${smallInputClass} flex items-center justify-center gap-1.5 text-center cursor-pointer hover:border-blue-500 transition ${isLoading ? 'opacity-60 pointer-events-none' : ''}`}>
        📁 {isLoading ? 'Import…' : "Importer depuis l'ordinateur"}
        <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </label>
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}

      <input
        type="text"
        value={isDataUrl(value) ? '' : value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={isDataUrl(value) ? "Ou remplacer par une URL d'image..." : (field.placeholder || "Ou collez une URL d'image...")}
        className={`${smallInputClass} mt-2`}
      />
    </div>
  );
};

const EmojiPickerField = ({ field, value, onChange }) => (
  <div>
    {field.label && <label className={labelClass}>{field.label}</label>}
    <div className="grid grid-cols-6 gap-2 bg-gray-950 p-3 rounded-xl border border-gray-800 mb-2">
      {(field.options || DEFAULT_EMOJIS).map((emoji) => (
        <button
          key={emoji}
          type="button"
          onClick={() => onChange(emoji)}
          className={`text-2xl p-2 rounded-lg hover:bg-gray-700 transition-all ${
            (value || field.defaultValue) === emoji ? 'bg-gray-800 ring-2 ring-blue-500 shadow-md' : 'bg-gray-900'
          }`}
        >
          {emoji}
        </button>
      ))}
    </div>
    <input
      type="text"
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Ou saisir un émoji..."
      className={`${smallInputClass} text-center`}
    />
  </div>
);

const ToggleField = ({ field, value, onChange }) => (
  <div>
    {field.label && <label className="block text-sm font-medium text-gray-300 mb-2">{field.label}</label>}
    <div className="flex bg-gray-950 p-1 rounded-xl border border-gray-800">
      {field.options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`flex-1 py-2.5 text-xs font-semibold rounded-lg transition ${
            (value || field.options[0].value) === opt.value ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  </div>
);

const ListField = ({ field, value, onChange }) => {
  const items = value && value.length > 0 ? value : Array(field.min || 1).fill('');
  const canAdd = !field.max || items.length < field.max;
  const canRemove = items.length > (field.min || 1);

  const updateItem = (i, v) => onChange(items.map((it, idx) => (idx === i ? v : it)));
  const addItem = () => onChange([...items, '']);
  const removeItem = (i) => onChange(items.filter((_, idx) => idx !== i));

  return (
    <div>
      {field.label && <label className={labelClass}>{field.label}</label>}
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2">
            <input
              type="text"
              value={item}
              onChange={(e) => updateItem(i, e.target.value)}
              placeholder={typeof field.itemPlaceholder === 'function' ? field.itemPlaceholder(i) : (field.itemPlaceholder || `Élément ${i + 1}`)}
              className="flex-1 bg-gray-800 border border-gray-700 text-white text-xs rounded p-2"
            />
            {canRemove && (
              <button type="button" onClick={() => removeItem(i)} aria-label="Supprimer cet élément" className="text-gray-500 hover:text-rose-500 px-1">✕</button>
            )}
          </div>
        ))}
      </div>
      {canAdd && (
        <button
          type="button"
          onClick={addItem}
          className="w-full mt-2 py-1.5 border border-dashed border-gray-700 text-gray-400 hover:text-white text-xs rounded transition"
        >
          + {field.addLabel || 'Ajouter un élément'}
        </button>
      )}
    </div>
  );
};

const resolveMaybeFn = (v, index) => (typeof v === 'function' ? v(index) : v);

const makeEmptyItem = (fields, index = 0) =>
  fields.reduce((acc, f) => ({ ...acc, [f.key]: resolveMaybeFn(f.defaultValue, index) ?? (f.type === 'list' ? [] : '') }), {});

const ObjectListField = ({ field, value, onChange }) => {
  const items = value && value.length > 0 ? value : Array.from({ length: field.min || 1 }, (_, i) => makeEmptyItem(field.fields, i));
  const countMode = field.countMode || 'fixed'; // 'fixed' | 'addRemove' | 'select'

  const updateItemField = (index, key, v) =>
    onChange(items.map((item, i) => (i === index ? { ...item, [key]: v } : item)));
  const addItem = () => onChange([...items, makeEmptyItem(field.fields, items.length)]);
  const removeItem = (index) => onChange(items.filter((_, i) => i !== index));
  const setCount = (count) => {
    const next = items.slice(0, count);
    while (next.length < count) next.push(makeEmptyItem(field.fields, next.length));
    onChange(next);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        {field.label && <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{field.label}</label>}
        {countMode === 'addRemove' && (!field.max || items.length < field.max) && (
          <button type="button" onClick={addItem} className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-2 py-1 rounded">
            + {field.addLabel || 'Ajouter'}
          </button>
        )}
      </div>

      {countMode === 'select' && (
        <select value={items.length} onChange={(e) => setCount(Number(e.target.value))} className={inputClass}>
          {Array.from({ length: (field.max || 7) - (field.min || 1) + 1 }, (_, i) => (field.min || 1) + i).map((n) => (
            <option key={n} value={n}>{n} {field.unitLabel || 'éléments'}</option>
          ))}
        </select>
      )}

      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="bg-gray-950 p-4 rounded-xl border border-gray-800 space-y-3 relative">
            {countMode === 'addRemove' && items.length > (field.min || 1) && (
              <button type="button" onClick={() => removeItem(index)} aria-label="Supprimer cet élément" className="absolute top-2 right-2 text-gray-600 hover:text-rose-500">✕</button>
            )}
            {field.fields.map((sub) => (
              <FieldRenderer
                key={sub.key}
                field={{
                  ...sub,
                  small: true,
                  placeholder: typeof sub.placeholder === 'function' ? sub.placeholder(index) : sub.placeholder,
                }}
                value={item[sub.key]}
                onChange={(v) => updateItemField(index, sub.key, v)}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

// Deux groupes {titre, items[]} côte à côte (ex: avantages/inconvénients, 2 colonnes).
// À la différence des autres champs, il lit/écrit directement deux clés du contenu
// (une par colonne) plutôt qu'une seule : il n'est utilisable qu'au premier niveau.
const TwoColumnListField = ({ field, content, onChange }) => (
  <div className="grid grid-cols-2 gap-4">
    {field.columns.map((col) => {
      const data = content?.[col.key] || { titre: col.defaultTitle || '', items: [''] };
      const updateData = (patch) => onChange(col.key, { ...data, ...patch });
      const updateItem = (i, v) => updateData({ items: data.items.map((it, idx) => (idx === i ? v : it)) });
      const addItem = () => data.items.length < (field.maxItems || 6) && updateData({ items: [...data.items, ''] });
      const removeItem = (i) => data.items.length > 1 && updateData({ items: data.items.filter((_, idx) => idx !== i) });

      return (
        <div key={col.key} className={`space-y-4 p-4 rounded-xl border ${col.containerClass || 'bg-gray-900/60 border-gray-800'}`}>
          <input
            type="text"
            value={data.titre}
            onChange={(e) => updateData({ titre: e.target.value })}
            className={`w-full bg-gray-800 border border-gray-700 font-bold rounded-lg p-2 focus:outline-none ${col.titleClass || 'text-blue-400'}`}
            placeholder={col.titlePlaceholder}
          />
          <div className="space-y-2">
            {data.items.map((item, i) => (
              <div key={i} className="flex gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => updateItem(i, e.target.value)}
                  className="flex-1 bg-gray-800 border border-gray-700 text-white text-xs rounded p-2"
                  placeholder={col.itemPlaceholder || 'Élément...'}
                />
                <button type="button" onClick={() => removeItem(i)} aria-label="Supprimer cet élément" className="text-gray-500 hover:text-rose-500 px-1">✕</button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addItem}
            className={`w-full py-1.5 border border-dashed text-xs rounded transition ${col.addClass || 'border-gray-700 text-gray-400 hover:text-white'}`}
          >
            + {col.addLabel || 'Ajouter un élément'}
          </button>
        </div>
      );
    })}
  </div>
);

const FieldRenderer = ({ field, value, onChange }) => {
  switch (field.type) {
    case 'text': return <TextField field={field} value={value} onChange={onChange} />;
    case 'textarea': return <TextareaField field={field} value={value} onChange={onChange} />;
    case 'number': return <NumberField field={field} value={value} onChange={onChange} />;
    case 'color': return <ColorField field={field} value={value} onChange={onChange} />;
    case 'image': return <ImageField field={field} value={value} onChange={onChange} />;
    case 'emojiPicker': return <EmojiPickerField field={field} value={value} onChange={onChange} />;
    case 'toggle': return <ToggleField field={field} value={value} onChange={onChange} />;
    case 'list': return <ListField field={field} value={value} onChange={onChange} />;
    case 'objectList': return <ObjectListField field={field} value={value} onChange={onChange} />;
    default: return null;
  }
};

export const GenericForm = ({ fields, content, onChange }) => (
  <div className="space-y-6">
    {fields.map((field) => (
      field.type === 'twoColumnList' ? (
        <TwoColumnListField key={field.key || 'twoColumnList'} field={field} content={content} onChange={onChange} />
      ) : (
        <FieldRenderer
          key={field.key}
          field={field}
          value={content?.[field.key]}
          onChange={(v) => onChange(field.key, v)}
        />
      )
    ))}

    {/* Notes du présentateur : commune à tous les templates */}
    <div className="border-t border-gray-800 pt-4">
      <label className={labelClass}>Notes du présentateur</label>
      <textarea
        value={content?.notes || ''}
        onChange={(e) => onChange('notes', e.target.value)}
        placeholder="Ajoutez vos points de discours ici..."
        rows={3}
        className={inputClass}
      />
    </div>
  </div>
);
