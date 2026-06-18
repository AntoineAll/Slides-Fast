import { Sidebar } from './components/Sidebar';
import { Editor } from './components/Editor';
import { useSlideStore } from './store/useSlideStore';

function App() {
  // On conserve l'état de la slide active
  const { activeSlideId } = useSlideStore();

  return (
    <div className="flex h-screen bg-gray-950 text-white overflow-hidden">
      <Sidebar />
      <Editor />
    </div>
  );
}

export default App;