import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Editor } from './components/Editor';
import { Presentation } from './components/Presentation'; 
import { PresenterMode } from './components/PresenterMode';
import { useSlideStore } from './store/useSlideStore';

function App({ isDisplayMode }) {
  const { slides, setSlides } = useSlideStore();
  const [mode, setMode] = useState(isDisplayMode ? 'display' : 'editor');

  const handleSave = async () => {
    const data = JSON.stringify(slides, null, 2);
    try {
      const handle = await window.showSaveFilePicker({
        suggestedName: 'SlidesFast.json',
        types: [{ description: 'JSON File', accept: { 'application/json': ['.json'] } }],
      });
      const writable = await handle.createWritable();
      await writable.write(data);
      await writable.close();
    } catch (err) {
      if (err.name !== 'AbortError') {
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'SlidesFast.json';
        a.click();
      }
    }
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        setSlides(JSON.parse(event.target.result));
      } catch (error) { alert("Erreur JSON invalide."); }
    };
    reader.readAsText(file);
  };

  const launchPresentation = async () => {
    if ('getScreenDetails' in window) {
      try {
        const screenDetails = await window.getScreenDetails();
        const secondary = screenDetails.screens.find(s => s !== screenDetails.currentScreen);
        if (secondary) {
          window.open(
            window.location.origin + window.location.pathname + '?mode=display', 
            'PresentationWindow', 
            `left=${secondary.left},top=${secondary.top},width=${secondary.width},height=${secondary.height}`
          );
          setMode('presenter');
          return;
        }
      } catch (e) { console.warn("Multi-écran indisponible"); }
    }
    setMode('display');
  };

  if (mode === 'display') {
    return <Presentation onExit={() => isDisplayMode ? window.close() : setMode('editor')} />;
  }

  if (mode === 'presenter') {
    return <PresenterMode onExit={() => setMode('editor')} />;
  }

  return (
    <div className="flex h-screen bg-gray-950 text-white overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <header className="h-14 border-b border-gray-800 flex items-center justify-end px-4 gap-2">
          <button onClick={launchPresentation} className="bg-blue-600 px-3 py-1 rounded text-sm hover:bg-blue-500">Lancer</button>
          <button onClick={handleSave} className="bg-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-600">Save</button>
          <label className="bg-gray-700 px-3 py-1 rounded text-sm cursor-pointer hover:bg-gray-600">
            Import
            <input type="file" className="hidden" accept=".json" onChange={handleImport} />
          </label>
        </header>
        <Editor />
      </div>
    </div>
  );
}
export default App;