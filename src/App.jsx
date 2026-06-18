import { Sidebar } from './components/Sidebar';
import { useSlideStore } from './store/useSlideStore';

function App() {
  // On récupère la slide active ici pour que App sache quelle slide afficher
  const { activeSlideId } = useSlideStore();

  return (
    <div className="flex h-screen bg-gray-950 text-white">
      <Sidebar />
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-4">
          Éditeur de la Slide {activeSlideId || 'Aucune'}
        </h1>
        {/*ici l'éditeur de contenu plus tard */}
      </main>
    </div>
  );
}

export default App;