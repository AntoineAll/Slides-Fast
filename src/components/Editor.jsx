const Editor = () => {
  const { slides, activeSlideId, updateSlideContent } = useSlideStore();
  const activeSlide = slides.find(s => s.id === activeSlideId);

  if (!activeSlide) return <div>Sélectionnez une slide</div>;

  return (
    <div>
      <input 
        value={activeSlide.content.titre || ''}
        onChange={(e) => updateSlideContent(activeSlide.id, { titre: e.target.value })}
      />
      {/* ... autres champs */}
    </div>
  );
}