import ReactDOM from 'react-dom/client';
import AppRouter from './router/Router';
import { Provider } from 'react-redux';
import store from './redux/store';

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <AppRouter />
  </Provider>
);
