import { Sidebar } from './components/Sidebar';

function App() {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <main style={{ padding: '20px' }}>
        <h1>Zone d'édition</h1>
        {/*ici l'éditeur de contenu plus tard */}
      </main>
    </div>
  );
}

export default App;