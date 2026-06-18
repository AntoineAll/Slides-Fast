import { useSlideStore } from '../store/useSlideStore';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Composant d'une slide individuelle
const SortableSlide = ({ slide, isActive, onClick, index }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: slide.id });
  
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="cursor-grab">
      <button
        onClick={onClick}
        className={`w-full p-3 rounded-lg text-left transition ${
          isActive 
            ? 'bg-blue-700 text-white border-2 border-blue-400' 
            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
        }`}
      >
        Slide {index + 1} - {slide.template}
      </button>
    </div>
  );
};

export const Sidebar = () => {
  const { slides, activeSlideId, setActiveSlideId, setSlides, addSlide } = useSlideStore();

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = slides.findIndex((s) => s.id === active.id);
      const newIndex = slides.findIndex((s) => s.id === over.id);
      setSlides(arrayMove(slides, oldIndex, newIndex));
    }
  };

  return (
    <aside className="w-64 h-screen bg-gray-900 border-r border-gray-700 p-4 flex flex-col">
      <button 
        onClick={() => addSlide()} 
        className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded mb-4 font-bold"
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
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </aside>
  );
};