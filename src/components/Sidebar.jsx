import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useSlideStore } from '../store/useSlideStore';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Menu "⋯" par slide (pour l'instant juste Dupliquer, pensé pour accueillir d'autres
// actions plus tard). Rendu via un portail dans <body> : la liste des slides défile
// (overflow-y-auto), un menu positionné en absolu à l'intérieur serait rogné au bord.
const SlideOptionsMenu = ({ onDuplicate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState(null);
  const buttonRef = useRef(null);
  const menuRef = useRef(null);

  const openMenu = () => {
    const rect = buttonRef.current.getBoundingClientRect();
    setPosition({ top: rect.bottom + 4, right: window.innerWidth - rect.right });
    setIsOpen(true);
  };

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e) => {
      if (!menuRef.current?.contains(e.target) && !buttonRef.current?.contains(e.target)) {
        setIsOpen(false);
      }
    };
    // Le menu est positionné une fois à l'ouverture : s'il fallait le suivre pendant un
    // défilement, on le referme plutôt que de le laisser se détacher de son bouton.
    const handleScroll = () => setIsOpen(false);
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll, true);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [isOpen]);

  return (
    <>
      <button
        ref={buttonRef}
        onClick={(e) => { e.stopPropagation(); isOpen ? setIsOpen(false) : openMenu(); }}
        title="Options de la slide"
        className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition"
      >
        ⋯
      </button>

      {isOpen && position && createPortal(
        <div
          ref={menuRef}
          style={{ position: 'fixed', top: position.top, right: position.right }}
          className="w-40 bg-gray-800 border border-gray-700 rounded-lg shadow-xl overflow-hidden z-50"
        >
          <button
            onClick={(e) => { e.stopPropagation(); setIsOpen(false); onDuplicate(); }}
            className="w-full text-left px-4 py-2.5 text-sm text-gray-200 hover:bg-gray-700 transition"
          >
            📋 Dupliquer
          </button>
        </div>,
        document.body
      )}
    </>
  );
};

const SortableSlide = ({ slide, isActive, onClick, index, onDelete, onDuplicate }) => {
  // C'est ici que setNodeRef est défini. S'il manque, le composant plante.
  const { 
    attributes, 
    listeners, 
    setNodeRef, 
    transform, 
    transition,
    isDragging
  } = useSortable({ id: slide.id });
  
  const style = { 
    transform: CSS.Transform.toString(transform ? { ...transform, x: 0 } : null), 
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : 0 
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center w-full pl-2 group">
      {/* DRAG HANDLE */}
      <div 
        {...attributes} 
        {...listeners} 
        className="cursor-grab text-gray-500 hover:text-white px-1.5 transition"
      >
        ⠿
      </div>

      {/* BOUTON SELECTION */}
      {/* min-w-0 : sans ça, un enfant flex-1 avec du texte "truncate" ne peut pas rétrécir
          sous la largeur de son texte complet, et pousse les boutons d'action hors de vue. */}
      <button
        onClick={onClick}
        className={`flex-1 min-w-0 p-3 rounded-lg text-left transition text-sm truncate ${
          isActive
            ? 'bg-blue-700 text-white border-2 border-blue-400'
            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
        }`}
      >
        Slide {index + 1} - {slide.content?.titre}
      </button>

      {/* ACTIONS (Dupliquer, Supprimer) */}
      <div className="flex items-center gap-2 ml-3 mr-0.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-200">
        <SlideOptionsMenu onDuplicate={() => onDuplicate(slide.id)} />
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(slide.id); }}
          className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-900/20 transition"
          title="Supprimer la slide"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export const Sidebar = () => {
  const { slides, activeSlideId, setActiveSlideId, setSlides, addSlide, removeSlide, duplicateSlide } = useSlideStore();

  // On ajoute un KeyboardSensor pour la compatibilité, mais le PointerSensor est suffisant
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = slides.findIndex((s) => s.id === active.id);
      const newIndex = slides.findIndex((s) => s.id === over.id);
      setSlides(arrayMove(slides, oldIndex, newIndex));
    }
  };

  return (
    <aside className="w-68 h-screen bg-gray-900 border-r border-gray-700 p-4 flex flex-col overflow-hidden">
      <button 
        onClick={() => addSlide()} 
        className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded mb-4 font-bold transition flex-shrink-0"
      >
        + Ajouter
      </button>
      
      <div className="flex-1 overflow-y-auto overflow-x-hidden pr-2">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={slides} strategy={verticalListSortingStrategy}>
            <div className="flex flex-col gap-2">
              {slides.map((slide, index) => (
                <SortableSlide 
                  key={slide.id}
                  slide={slide} 
                  index={index} 
                  isActive={activeSlideId === slide.id} 
                  onClick={() => setActiveSlideId(slide.id)}
                  onDelete={removeSlide}
                  onDuplicate={duplicateSlide}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </aside>
  );
};