// src/main.jsx
import ReactDOM from 'react-dom/client';
import AppRouter from './router/Router';
import { Provider } from 'react-redux';
import store from './redux/store';
import { ThemeProvider } from './components/theme/ThemeContext'; // ⬅️ Əlavə et

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <ThemeProvider> {/* ⬅️ Əhatə et */}
      <AppRouter />
    </ThemeProvider>
  </Provider>
);
