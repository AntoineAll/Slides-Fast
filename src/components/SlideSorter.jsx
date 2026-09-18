import { useEffect, useRef } from 'react';
import { useSlideStore } from '../store/useSlideStore';
import { templates } from '../templates';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, rectSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const SLIDE_WIDTH = 850;
const SLIDE_HEIGHT = 478; // même format 16:9 que l'aperçu de l'éditeur
const THUMB_WIDTH = 260;
const THUMB_SCALE = THUMB_WIDTH / SLIDE_WIDTH;
const THUMB_HEIGHT = SLIDE_HEIGHT * THUMB_SCALE;

const SlideThumbnail = ({ slide, index, isActive, onOpen, onKeyDown, registerRef }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: slide.id });
  const Visual = templates[slide.templateId]?.Visual;
  const title = slide.content?.titre || 'Sans titre';

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 50 : 0,
  };

  return (
    <div
      ref={(node) => { setNodeRef(node); registerRef(slide.id, node); }}
      style={style}
      {...attributes}
      {...listeners}
      onDoubleClick={() => onOpen(slide.id)}
      onKeyDown={(e) => onKeyDown(e, index)}
      title="Glisser pour réorganiser • Entrée ou double-clic pour ouvrir"
      aria-label={`Diapositive ${index + 1} : ${title}. Entrée pour l'ouvrir.`}
      className={`select-none cursor-grab active:cursor-grabbing rounded-xl border-2 p-1.5 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
        isActive ? 'border-blue-500 bg-blue-500/5' : 'border-transparent hover:border-gray-700'
      }`}
    >
      {/* Le Visual a sa propre taille fixe (850x478) : on le réduit avec un scale CSS plutôt
          que de le redimensionner, pour ne jamais déformer ni recalculer sa mise en page. */}
      <div style={{ width: THUMB_WIDTH, height: THUMB_HEIGHT }} className="relative overflow-hidden rounded-lg bg-gray-900 shadow-md">
        <div
          style={{ width: SLIDE_WIDTH, height: SLIDE_HEIGHT, transform: `scale(${THUMB_SCALE})`, transformOrigin: 'top left' }}
          className="absolute top-0 left-0 pointer-events-none"
        >
          {Visual && <Visual content={slide.content} />}
        </div>
      </div>
      <p className={`mt-2 px-1 text-xs truncate ${isActive ? 'text-blue-400' : 'text-gray-400'}`}>
        {index + 1}. {title}
      </p>
    </div>
  );
};

// Grille de toutes les slides en miniature ("slide sorter") : pour naviguer et réorganiser
// un deck de nombreuses slides sans avoir à faire défiler la barre latérale une par une.
export const SlideSorter = ({ onClose }) => {
  const { slides, activeSlideId, setSlides, setActiveSlideId } = useSlideStore();
  const gridRef = useRef(null);
  const thumbRefs = useRef(new Map());

  useEffect(() => {
    const handleKeyDown = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = slides.findIndex((s) => s.id === active.id);
      const newIndex = slides.findIndex((s) => s.id === over.id);
      setSlides(arrayMove(slides, oldIndex, newIndex));
    }
  };

  const openSlide = (id) => {
    setActiveSlideId(id);
    onClose();
  };

  const focusThumbAt = (index) => {
    const clamped = Math.max(0, Math.min(slides.length - 1, index));
    thumbRefs.current.get(slides[clamped]?.id)?.focus();
  };

  // La grille utilise repeat(auto-fill, ...) : le nombre de colonnes dépend de la largeur
  // disponible et n'est connu qu'à l'affichage. On le lit directement depuis le CSS calculé
  // plutôt que de le recalculer nous-mêmes, pour que Haut/Bas restent justes à tout moment.
  const getColumnCount = () => {
    if (!gridRef.current) return 1;
    return getComputedStyle(gridRef.current).gridTemplateColumns.split(' ').filter(Boolean).length || 1;
  };

  const handleThumbKeyDown = (e, index) => {
    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        openSlide(slides[index].id);
        break;
      case 'ArrowRight':
        e.preventDefault();
        focusThumbAt(index + 1);
        break;
      case 'ArrowLeft':
        e.preventDefault();
        focusThumbAt(index - 1);
        break;
      case 'ArrowDown':
        e.preventDefault();
        focusThumbAt(index + getColumnCount());
        break;
      case 'ArrowUp':
        e.preventDefault();
        focusThumbAt(index - getColumnCount());
        break;
      case 'Home':
        e.preventDefault();
        focusThumbAt(0);
        break;
      case 'End':
        e.preventDefault();
        focusThumbAt(slides.length - 1);
        break;
      default:
        break;
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-950 z-50 flex flex-col">
      <header className="h-14 border-b border-gray-800 flex items-center justify-between px-6 flex-shrink-0">
        <div>
          <h2 className="text-white font-semibold">Vue d'ensemble</h2>
          <p className="text-xs text-gray-500">Glissez pour réorganiser • Double-clic ou flèches puis Entrée pour ouvrir une slide</p>
        </div>
        <button
          onClick={onClose}
          className="bg-gray-800 text-gray-300 px-3 py-1 rounded text-xs hover:bg-gray-700 transition"
        >
          ✕ Retour à l'éditeur (Échap)
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-8">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={slides} strategy={rectSortingStrategy}>
            <div
              ref={gridRef}
              className="grid gap-6 mx-auto max-w-6xl"
              style={{ gridTemplateColumns: `repeat(auto-fill, minmax(${THUMB_WIDTH}px, 1fr))` }}
            >
              {slides.map((slide, index) => (
                <SlideThumbnail
                  key={slide.id}
                  slide={slide}
                  index={index}
                  isActive={activeSlideId === slide.id}
                  onOpen={openSlide}
                  onKeyDown={handleThumbKeyDown}
                  registerRef={(id, node) => {
                    if (node) thumbRefs.current.set(id, node);
                    else thumbRefs.current.delete(id);
                  }}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
};
