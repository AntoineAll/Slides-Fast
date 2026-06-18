import { useSlideStore } from '../store/useSlideStore';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';


const SortableSlide = ({ slide, isActive, onClick, index, onDelete }) => {
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
    <div ref={setNodeRef} style={style} className="flex items-center w-full px-2 group">
      {/* DRAG HANDLE */}
      <div 
        {...attributes} 
        {...listeners} 
        className="cursor-grab text-gray-500 hover:text-white px-1.5 transition"
      >
        ⠿
      </div>

      {/* BOUTON SELECTION */}
      <button
        onClick={onClick}
        className={`flex-1 p-3 rounded-lg text-left transition text-sm truncate ${
          isActive 
            ? 'bg-blue-700 text-white border-2 border-blue-400' 
            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
        }`}
      >
        Slide {index + 1} - {slide.template}
      </button>

      {/* BOUTON SUPPRESSION */}
      <button
        onClick={(e) => { e.stopPropagation(); onDelete(slide.id); }}
        className="ml-3 p-3 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-900/20 opacity-0 group-hover:opacity-100 transition-all duration-200"
        title="Supprimer la slide"
      >
        ×
      </button>
    </div>
  );
};

export const Sidebar = () => {
  const { slides, activeSlideId, setActiveSlideId, setSlides, addSlide, removeSlide } = useSlideStore();

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
    <aside className="w-64 h-screen bg-gray-900 border-r border-gray-700 p-4 flex flex-col overflow-hidden">
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
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </aside>
  );
};