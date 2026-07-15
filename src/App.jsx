import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Editor } from './components/Editor';
import { Presentation } from './components/Presentation'; 
import { useSlideStore } from './store/useSlideStore';

function App() {
  const { slides, setSlides } = useSlideStore();
  const [mode, setMode] = useState('editor'); // 'editor' | 'presentation'

  // Sauvegarder en local (téléchargement du JSON)
  const handleSave = () => {
    const data = JSON.stringify(slides);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'presentation.json';
    a.click();
  };

  // Charger depuis le PC
  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedSlides = JSON.parse(event.target.result);
        setSlides(importedSlides);
      } catch (error) {
        alert("Erreur lors de l'importation du fichier : format JSON invalide.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex h-screen bg-gray-950 text-white overflow-hidden">
      {mode === 'editor' ? (
        <>
          <Sidebar />
          <div className="flex-1 flex flex-col">
            {/* Barre d'outils */}
            <header className="h-14 border-b border-gray-800 flex items-center justify-end px-4 gap-2">
              <button 
                onClick={() => setMode('presentation')} 
                className="bg-blue-600 px-3 py-1 rounded text-sm hover:bg-blue-500 transition-colors"
              >
                Lancer Présentation
              </button>
              <button 
                onClick={handleSave} 
                className="bg-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-600 transition-colors"
              >
                Sauvegarder
              </button>
              <label className="bg-gray-700 px-3 py-1 rounded text-sm cursor-pointer hover:bg-gray-600 transition-colors">
                Importer
                <input 
                  type="file" 
                  className="hidden" 
                  accept=".json" 
                  onChange={handleImport} 
                />
              </label>
            </header>
            
            <Editor />
          </div>
        </>
      ) : (
        <Presentation onExit={() => setMode('editor')} />
      )}
    </div>
  );
}

export default App;