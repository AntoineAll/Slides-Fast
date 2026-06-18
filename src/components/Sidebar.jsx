import { useSlideStore } from '../store/useSlideStore';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Composant d'une slide individuelle
const SortableSlide = ({ slide, isActive, onClick, index, onDelete }) => {
  const { 
    attributes, 
    listeners, 
    setNodeRef, 
    transform, 
    transition,
    isDragging
  } = useSortable({ id: slide.id });
  
  const style = { 
    transform: CSS.Transform.toString(transform), 
    transition,
    opacity: isDragging ? 0.5 : 1 // Effet visuel pendant le drag
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group">
      <div {...attributes} {...listeners} className="cursor-grab absolute inset-0 z-10" />

      <button
        onClick={onClick}
        className={`w-full p-3 rounded-lg text-left transition relative z-0 ${
          isActive 
            ? 'bg-blue-700 text-white border-2 border-blue-400' 
            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
        }`}
      >
        Slide {index + 1} - {slide.template}
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(slide.id);
        }}
        className="absolute right-2 top-2.5 w-6 h-6 z-20 flex items-center justify-center bg-red-700 hover:bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition text-xs font-bold"
        title="Supprimer"
      >
        ×
      </button>
    </div>
  );
};

export const Sidebar = () => {
  const { slides, activeSlideId, setActiveSlideId, setSlides, addSlide, removeSlide } = useSlideStore();

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = slides.findIndex((s) => s.id === active.id);
      const newIndex = slides.findIndex((s) => s.id === over.id);
      setSlides(arrayMove(slides, oldIndex, newIndex));
    }
  };

  return (
    <aside className="w-64 h-screen bg-gray-900 border-r border-gray-700 p-4 flex flex-col">
      <button 
        onClick={() => addSlide()} 
        className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded mb-4 font-bold transition"
      >
        + Ajouter
      </button>
      
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={slides} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-2 overflow-y-auto">
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
    </aside>
  );
};