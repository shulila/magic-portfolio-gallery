
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Add Hebrew lang attribute and RTL direction to the document
document.documentElement.lang = 'he';
document.documentElement.dir = 'rtl';

createRoot(document.getElementById("root")!).render(<App />);
