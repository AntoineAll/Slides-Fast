import { useCallback, useEffect, useRef, useState } from 'react';
import { loadFileHandle, saveFileHandle, clearFileHandle } from '../utils/fileHandleStore';
import { validateImportedSlides } from '../utils/validateImport';

const WRITE_DEBOUNCE_MS = 1500;
const JSON_FILE_TYPES = [{ description: 'JSON File', accept: { 'application/json': ['.json'] } }];

const writeDocumentToHandle = async (handle, slides, logoUrl, theme) => {
  const writable = await handle.createWritable();
  await writable.write(JSON.stringify({ slides, logoUrl, theme }, null, 2));
  await writable.close();
};

// Sauvegarde continue de la présentation sur un vrai fichier disque, une fois lié.
// status: 'unsupported' | 'unlinked' | 'needs-permission' | 'linked' | 'saving' | 'error'
// onOpenExisting(slides, logoUrl, theme) est appelé quand un fichier ouvert contient déjà une
// présentation valide, pour la charger dans l'éditeur.
export const useAutoSave = (slides, logoUrl, theme, enabled, onOpenExisting) => {
  const isSupported = typeof window !== 'undefined' && 'showOpenFilePicker' in window && 'showSaveFilePicker' in window;
  const [status, setStatus] = useState(isSupported ? 'unlinked' : 'unsupported');
  const [fileName, setFileName] = useState(null);
  const handleRef = useRef(null);

  // Au montage : reprendre le fichier lié lors d'une session précédente, si possible.
  useEffect(() => {
    if (!isSupported) return;
    let cancelled = false;
    (async () => {
      const handle = await loadFileHandle();
      if (cancelled || !handle) return;
      const permission = await handle.queryPermission({ mode: 'readwrite' });
      handleRef.current = handle;
      setFileName(handle.name);
      setStatus(permission === 'granted' ? 'linked' : 'needs-permission');
    })();
    return () => { cancelled = true; };
  }, [isSupported]);

  const linkHandle = useCallback(async (handle) => {
    await saveFileHandle(handle);
    handleRef.current = handle;
    setFileName(handle.name);
    setStatus('linked');
  }, []);

  // Ouvrir un fichier de présentation EXISTANT : le charger dans l'éditeur, puis continuer
  // à l'auto-sauvegarder. showOpenFilePicker est la seule API fiable pour LIRE un fichier —
  // un handle obtenu via showSaveFilePicker ne garantit pas de refléter son contenu existant.
  const openExisting = useCallback(async () => {
    let handle;
    try {
      [handle] = await window.showOpenFilePicker({ types: JSON_FILE_TYPES });
    } catch (err) {
      if (err.name !== 'AbortError') console.error("Sélection du fichier impossible :", err);
      return;
    }

    const permission = await handle.requestPermission({ mode: 'readwrite' });
    if (permission !== 'granted') {
      alert("Permission d'écriture refusée : l'auto-save ne peut pas être activé sur ce fichier.");
      return;
    }

    const file = await handle.getFile();
    if (file.size > 0) {
      let data;
      try {
        data = JSON.parse(await file.text());
      } catch {
        alert("Ce fichier n'est pas un JSON valide, il n'a pas été modifié.");
        return;
      }
      const result = validateImportedSlides(data);
      if (!result.ok) {
        alert(`Ce fichier ne ressemble pas à une présentation SlidesFast, il n'a pas été modifié :\n\n${result.errors.join('\n')}`);
        return;
      }
      onOpenExisting?.(result.slides, result.logoUrl, result.theme);
    } else {
      await writeDocumentToHandle(handle, slides, logoUrl, theme);
    }

    await linkHandle(handle);
  }, [slides, logoUrl, theme, onOpenExisting, linkHandle]);

  // Créer un NOUVEAU fichier et y démarrer l'auto-save avec le contenu actuel de l'éditeur.
  const createNew = useCallback(async () => {
    let handle;
    try {
      handle = await window.showSaveFilePicker({
        suggestedName: 'SlidesFast.json',
        types: JSON_FILE_TYPES,
      });
    } catch (err) {
      if (err.name !== 'AbortError') console.error("Sélection du fichier impossible :", err);
      return;
    }
    await writeDocumentToHandle(handle, slides, logoUrl, theme);
    await linkHandle(handle);
  }, [slides, logoUrl, theme, linkHandle]);

  // Le navigateur exige un geste utilisateur pour redemander la permission après un rechargement.
  const grantPermission = useCallback(async () => {
    if (!handleRef.current) return;
    const permission = await handleRef.current.requestPermission({ mode: 'readwrite' });
    setStatus(permission === 'granted' ? 'linked' : 'needs-permission');
  }, []);

  const unlink = useCallback(async () => {
    await clearFileHandle();
    handleRef.current = null;
    setFileName(null);
    setStatus('unlinked');
  }, []);

  // Écriture différée à chaque changement de contenu, tant qu'un fichier est lié et autorisé.
  useEffect(() => {
    if (!enabled || status !== 'linked' || !handleRef.current) return;
    const timer = setTimeout(async () => {
      try {
        setStatus('saving');
        await writeDocumentToHandle(handleRef.current, slides, logoUrl, theme);
        setStatus('linked');
      } catch (err) {
        console.error("Échec de l'auto-save :", err);
        setStatus('error');
      }
    }, WRITE_DEBOUNCE_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slides, logoUrl, theme, enabled]);

  return { isSupported, status, fileName, openExisting, createNew, grantPermission, unlink };
};
