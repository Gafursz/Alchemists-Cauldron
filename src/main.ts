import './styles/style.css';
import { renderApp } from './ui/app';

const root = document.querySelector<HTMLDivElement>('#app');

if (!root) {
  throw new Error('Application root #app was not found');
}

renderApp(root);
