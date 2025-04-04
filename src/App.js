import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TaskFormatter from './components/TaskFormater';
import PreviewPage from './components/PreviewPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TaskFormatter />} />
        <Route path="/preview" element={<PreviewPage />} />
      </Routes>
    </Router>
  );
}

export default App;
