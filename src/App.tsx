import { ThemeProvider } from './context/ThemeContext';
import Calculator from './components/Calculator';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <div className="app">
        <Calculator />
      </div>
    </ThemeProvider>
  );
}

export default App;
