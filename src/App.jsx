import { useState, useEffect, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { Editor } from './components/Editor';
import { Presentation } from './components/Presentation';
import { PresenterMode } from './components/PresenterMode';
import { OptionsMenu } from './components/OptionsMenu';
import { SlideSorter } from './components/SlideSorter';
import { useSlideStore } from './store/useSlideStore';
import { presentationPresets } from './data/presentationPresets';
import { validateImportedSlides } from './utils/validateImport';
import { useAutoSave } from './hooks/useAutoSave';

function App({ isDisplayMode }) {
  const { slides, activeSlideId, setSlides, setActiveSlideId, undo, redo, past, future } = useSlideStore();

  const [mode, setMode] = useState(() => {
    if (isDisplayMode) return 'display';
    return slides && slides.length > 0 ? 'editor' : 'home';
  });

  // Remplace tout le document par un autre (preset, import, ouverture via auto-save) :
  // setSlides seul ne suffit pas, activeSlideId pointerait vers un id qui n'existe plus
  // dans les nouvelles slides (elles ont toutes de nouveaux id), et l'éditeur semblerait vide.
  const loadNewDocument = useCallback((newSlides) => {
    setSlides(newSlides);
    setActiveSlideId(newSlides[0]?.id ?? null);
  }, [setSlides, setActiveSlideId]);

  const autoSave = useAutoSave(slides, mode === 'editor', loadNewDocument);

  // Protection contre la fermeture accidentelle de l'onglet/rafraîchissement global
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if ((mode === 'editor' || mode === 'overview') && slides && slides.length > 0) {
        e.preventDefault();
        e.returnValue = ''; // Nécessaire pour déclencher l'alerte native du navigateur
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [mode, slides]);

  // Raccourcis clavier Annuler/Rétablir (Ctrl/Cmd+Z, Ctrl/Cmd+Shift+Z ou Ctrl+Y)
  // On laisse le undo natif du navigateur gérer un champ texte en cours de focus.
  useEffect(() => {
    if (mode !== 'editor') return;
    const handleKeyDown = (e) => {
      const isModKey = e.ctrlKey || e.metaKey;
      if (!isModKey || e.key.toLowerCase() !== 'z' && e.key.toLowerCase() !== 'y') return;

      const target = e.target;
      const isEditableField = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;
      if (isEditableField) return;

      if (e.key.toLowerCase() === 'y' || (e.key.toLowerCase() === 'z' && e.shiftKey)) {
        e.preventDefault();
        redo();
      } else if (e.key.toLowerCase() === 'z') {
        e.preventDefault();
        undo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mode, undo, redo]);

  // Navigation clavier entre slides (flèches haut/gauche = précédente, bas/droite =
  // suivante), utile aussi bien depuis l'onglet Visuel que Formulaire. On ignore les
  // champs éditables (et les <select>, dont les flèches changent nativement la valeur)
  // pour ne jamais interférer avec la saisie.
  useEffect(() => {
    if (mode !== 'editor') return;
    const handleKeyDown = (e) => {
      if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) return;

      const target = e.target;
      const isEditableField = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' || target.isContentEditable;
      if (isEditableField) return;

      const currentIndex = slides.findIndex((s) => s.id === activeSlideId);
      if (currentIndex === -1) return;

      const delta = (e.key === 'ArrowUp' || e.key === 'ArrowLeft') ? -1 : 1;
      const nextIndex = currentIndex + delta;
      if (nextIndex < 0 || nextIndex >= slides.length) return;

      e.preventDefault();
      setActiveSlideId(slides[nextIndex].id);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mode, slides, activeSlideId, setActiveSlideId]);

  // Clonage profond et ajout d'un ID unique par slide
  const handleSelectPreset = async (preset) => {
    const freshSlides = preset.slides.map((slide) => ({
      ...slide,
      id: crypto.randomUUID(),
      content: JSON.parse(JSON.stringify(slide.content || {}))
    }));

    // On détache l'auto-save avant de charger un autre document : sinon ces nouvelles
    // slides (vierges) seraient écrites dans l'ancien fichier lié, l'écrasant.
    await autoSave.unlink();
    loadNewDocument(freshSlides);
    setMode('editor');
  };

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
      return true; // Sauvegarde réussie
    } catch (err) {
      if (err.name !== 'AbortError') {
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'SlidesFast.json';
        a.click();
        return true;
      }
      return false; // Annulé par l'utilisateur
    }
  };

  // Raccourci clavier Ctrl/Cmd+S : sauvegarde locale au lieu de la boîte "Enregistrer la page" du navigateur
  useEffect(() => {
    if (mode !== 'editor') return;
    const handleKeyDown = (e) => {
      const isModKey = e.ctrlKey || e.metaKey;
      if (!isModKey || e.key.toLowerCase() !== 's') return;
      e.preventDefault();
      handleSave();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mode, handleSave]);

  // Sécurisation du retour à l'accueil avec option de sauvegarde
  const handleGoHome = async () => {
    // L'auto-save garde déjà le fichier à jour, inutile de redemander une sauvegarde manuelle
    if (slides && slides.length > 0 && autoSave.status !== 'linked') {
      const wantToSave = window.confirm(
        "Attention, retourner à l'accueil va réinitialiser ou changer votre présentation en cours.\nVoulez-vous sauvegarder votre travail avant de quitter ?"
      );
      
      if (wantToSave) {
        const saved = await handleSave();
        if (!saved) return; // Si l'utilisateur a annulé la boîte de sauvegarde, on stoppe le retour à l'accueil
      }
    }
    setMode('home');
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      let data;
      try {
        data = JSON.parse(event.target.result);
      } catch (error) {
        alert("Erreur : ce fichier n'est pas un JSON valide.");
        return;
      }

      const result = validateImportedSlides(data);
      if (!result.ok) {
        alert(`Impossible d'importer ce fichier :\n\n${result.errors.join('\n')}`);
        return;
      }

      // Idem : on détache l'auto-save avant de charger ce nouveau document, pour ne pas
      // écraser l'ancien fichier lié avec le contenu qu'on vient d'importer.
      await autoSave.unlink();
      loadNewDocument(result.slides);
      setMode('editor');
    };
    reader.readAsText(file);
    e.target.value = ''; // permet de réimporter le même fichier après une erreur
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

  // 1. Écran d'affichage secondaire
  if (mode === 'display') {
    return <Presentation onExit={() => isDisplayMode ? window.close() : setMode('editor')} />;
  }

  // 2. Écran du mode Présentateur
  if (mode === 'presenter') {
    return <PresenterMode onExit={() => setMode('editor')} />;
  }

  // 2bis. Vue d'ensemble (slide sorter)
  if (mode === 'overview') {
    return <SlideSorter onClose={() => setMode('editor')} />;
  }

  // 3. Écran d'Accueil / Sélecteur de Presets
  if (mode === 'home') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-cyan-500/10 to-indigo-500/10 blur-[120px] pointer-events-none rounded-full" />

        <div className="max-w-4xl w-full space-y-10 relative z-10">
          <div className="text-center space-y-3">
            <h1 className="text-5xl font-black tracking-tight text-white">
              Bienvenue sur <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent">SlidesFast</span>
            </h1>
            <p className="text-slate-400 text-sm max-w-xl mx-auto leading-relaxed">
              Sélectionnez un modèle structuré pour démarrer instantanément ou optez pour une page blanche.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {presentationPresets.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className="group bg-slate-900/40 hover:bg-slate-900/80 border border-slate-800/80 hover:border-cyan-500/50 transition-all duration-300 rounded-2xl p-6 text-left flex flex-col justify-between shadow-xl relative overflow-hidden backdrop-blur-sm"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                
                <div className="relative z-10">
                  <div className="text-2xl mb-4 bg-slate-800/80 w-12 h-12 rounded-xl flex items-center justify-center border border-slate-700/50 group-hover:scale-105 group-hover:border-cyan-500/40 transition-all shadow-md">
                    {preset.icon}
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {preset.name}
                  </h3>
                  <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                    {preset.description}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-800/60 flex items-center justify-between text-[11px] font-mono text-slate-400 group-hover:text-cyan-400 relative z-10 transition-colors">
                  <span className="tracking-wide font-medium">UTILISER CE MODÈLE</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </button>
            ))}
          </div>

          <div className="flex items-center justify-center gap-6 pt-2">
            <label className="group relative px-5 py-2.5 bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-indigo-500/50 text-slate-300 hover:text-white rounded-xl text-xs font-medium transition-all duration-300 shadow-md hover:shadow-indigo-500/10 cursor-pointer flex items-center gap-2">
              <span className="text-indigo-400 group-hover:scale-110 transition-transform">📂</span>
              Importer un JSON
              <input type="file" className="hidden" accept=".json" onChange={handleImport} />
          </label>
          </div>
        </div>
      </div>
    );
  }

  // 4. Éditeur Principal
  return (
    <div className="flex h-screen bg-gray-950 text-white overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <header className="h-14 border-b border-gray-800 flex items-center justify-between px-4 gap-2">
          {/* Bouton Accueil sécurisé par une confirmation */}
          <button 
            onClick={handleGoHome} 
            className="bg-gray-800 text-gray-300 px-3 py-1 rounded text-xs hover:bg-gray-700 transition"
          >
            🏠 Accueil / Presets
          </button>
          
          <div className="flex items-center gap-2">
            <button
              onClick={undo}
              disabled={past.length === 0}
              title="Annuler (Ctrl+Z)"
              className="bg-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-600 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-gray-700"
            >
              ↶
            </button>
            <button
              onClick={redo}
              disabled={future.length === 0}
              title="Rétablir (Ctrl+Shift+Z)"
              className="bg-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-600 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-gray-700"
            >
              ↷
            </button>
            <button
              onClick={() => setMode('overview')}
              title="Vue d'ensemble de toutes les slides"
              className="bg-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-600"
            >
              Overview
            </button>
            <div className="w-px h-5 bg-gray-800 mx-1" />
            <button onClick={launchPresentation} className="bg-blue-600 px-3 py-1 rounded text-sm hover:bg-blue-500">Lancer</button>
            <button onClick={handleSave} className="bg-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-600">Save</button>
            <label className="bg-gray-700 px-3 py-1 rounded text-sm cursor-pointer hover:bg-gray-600">
              Import
              <input type="file" className="hidden" accept=".json" onChange={handleImport} />
            </label>
            <OptionsMenu slides={slides} />

            {autoSave.isSupported && (
              <>
                <div className="w-px h-5 bg-gray-800 mx-1" />
                {autoSave.status === 'unlinked' && (
                  <>
                    <button
                      onClick={autoSave.openExisting}
                      title="Ouvrir une présentation existante et la garder synchronisée sur ce fichier"
                      className="bg-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-600"
                    >
                      📂 Ouvrir
                    </button>
                    <button
                      onClick={autoSave.createNew}
                      title="Créer un nouveau fichier disque et y auto-sauvegarder cette présentation"
                      className="bg-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-600"
                    >
                      ✨ Nouveau (auto-save)
                    </button>
                  </>
                )}
                {autoSave.status === 'needs-permission' && (
                  <button
                    onClick={autoSave.grantPermission}
                    title={`Réautoriser l'accès à ${autoSave.fileName}`}
                    className="bg-amber-700 px-3 py-1 rounded text-sm hover:bg-amber-600"
                  >
                    🔓 Réautoriser l'auto-save
                  </button>
                )}
                {(autoSave.status === 'linked' || autoSave.status === 'saving') && (
                  <div className="flex items-center gap-1.5 text-xs text-gray-400" title={autoSave.fileName}>
                    <span>💾 {autoSave.status === 'saving' ? 'Sauvegarde…' : autoSave.fileName}</span>
                    <button
                      onClick={autoSave.unlink}
                      title="Désactiver l'auto-save"
                      className="text-gray-500 hover:text-red-400 px-1"
                    >
                      ✕
                    </button>
                  </div>
                )}
                {autoSave.status === 'error' && (
                  <span className="text-xs text-red-400" title="Échec de l'écriture sur le disque, réessai à la prochaine modification">
                    ⚠ Auto-save en erreur
                  </span>
                )}
              </>
            )}
          </div>
        </header>
        <Editor />
      </div>
    </div>
  );
}

export default App;