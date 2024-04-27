import './App.css';
import PersistentDrawerLeft from './components/Sidebar';
import { BrowserRouter as Router } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Router>
        <PersistentDrawerLeft/>
      </Router>
    </div>
  );
}

export default App;
