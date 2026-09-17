import { useEffect, useRef, useState } from 'react';

const COUNTDOWN_PRESETS_MIN = [3, 5, 10, 15, 20, 30];
const DEFAULT_COUNTDOWN_MINUTES = 5;

const formatDuration = (ms) => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

// Minuteur du présentateur : chronomètre (temps écoulé) ou compte à rebours depuis une
// durée choisie, pour garder le rythme pendant une présentation réelle. Purement local à
// cette session (pas persisté), ça ne fait pas partie du contenu de la présentation.
export const PresenterTimer = () => {
  const [timerMode, setTimerMode] = useState('up'); // 'up' (chrono) | 'down' (compte à rebours)
  const [countdownMinutes, setCountdownMinutes] = useState(DEFAULT_COUNTDOWN_MINUTES);
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const startRef = useRef(null); // timestamp d'où repartir, pour rester juste malgré les pauses

  useEffect(() => {
    if (!isRunning) return;
    startRef.current = Date.now() - elapsedMs;
    // Recalculé depuis Date.now() à chaque tick plutôt qu'incrémenté de 250ms : évite toute
    // dérive due à l'imprécision des timers JS sur une présentation qui peut durer longtemps.
    const interval = setInterval(() => setElapsedMs(Date.now() - startRef.current), 250);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning]);

  const handleReset = () => {
    setIsRunning(false);
    setElapsedMs(0);
  };

  const handleModeChange = (nextMode) => {
    setTimerMode(nextMode);
    handleReset();
  };

  const remainingMs = countdownMinutes * 60 * 1000 - elapsedMs;
  const displayMs = timerMode === 'down' ? remainingMs : elapsedMs;
  const isOvertime = timerMode === 'down' && remainingMs < 0;
  const isLowTime = timerMode === 'down' && remainingMs >= 0 && remainingMs < 60_000;

  return (
    <div className="bg-gray-900 p-4 rounded-xl border border-gray-700 flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex bg-gray-950 p-1 rounded-lg text-xs">
          <button
            onClick={() => handleModeChange('up')}
            className={`px-2.5 py-1 rounded-md transition ${timerMode === 'up' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            Chrono
          </button>
          <button
            onClick={() => handleModeChange('down')}
            className={`px-2.5 py-1 rounded-md transition ${timerMode === 'down' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            Compte à rebours
          </button>
        </div>

        {timerMode === 'down' && (
          <select
            value={countdownMinutes}
            onChange={(e) => setCountdownMinutes(Number(e.target.value))}
            disabled={isRunning || elapsedMs > 0}
            className="bg-gray-950 border border-gray-800 text-gray-300 text-xs rounded px-1.5 py-1 disabled:opacity-50"
          >
            {COUNTDOWN_PRESETS_MIN.map((m) => (
              <option key={m} value={m}>{m} min</option>
            ))}
          </select>
        )}
      </div>

      <div
        className={`text-4xl font-mono font-bold text-center tabular-nums ${
          isOvertime ? 'text-red-500' : isLowTime ? 'text-amber-400' : 'text-white'
        }`}
      >
        {isOvertime ? '+' : ''}{formatDuration(Math.abs(displayMs))}
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setIsRunning((r) => !r)}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition text-white ${
            isRunning ? 'bg-amber-700 hover:bg-amber-600' : 'bg-emerald-700 hover:bg-emerald-600'
          }`}
        >
          {isRunning ? '⏸ Pause' : '▶ Démarrer'}
        </button>
        <button
          onClick={handleReset}
          aria-label="Réinitialiser le minuteur"
          title="Réinitialiser"
          className="px-4 py-2 rounded-lg text-sm bg-gray-700 hover:bg-gray-600 text-gray-200 transition"
        >
          ↺
        </button>
      </div>
    </div>
  );
};
