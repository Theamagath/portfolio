import { render } from 'solid-js/web';
import { lazy } from 'solid-js';
import App from './App';
import './style.css';

const root = document.getElementById('root');
if (!root) throw new Error('Elemen #root tidak ditemukan.');
const Admin = lazy(() => import('./Admin'));
render(() => /^\/admin\/?$/.test(window.location.pathname) ? <Admin /> : <App />, root);
