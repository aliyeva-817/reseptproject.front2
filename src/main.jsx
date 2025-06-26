import ReactDOM from "react-dom/client";
import AppRouter from "./router/Router";
import { Provider } from "react-redux";
import store from "./redux/store";
import { ThemeProvider } from "./components/theme/ThemeContext";
import { AuthProvider } from "./context/AuthContext";

import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { SnackbarProvider } from 'notistack';

// ✅ Toastify üçün xüsusi bağlama düyməsi
const customClose = ({ closeToast }) => (
  <button
    onClick={closeToast}
    style={{
      position: 'absolute',
      top: '8px',
      right: '10px',
      background: 'transparent',
      border: 'none',
      fontSize: '14px',
      cursor: 'pointer',
      opacity: 0.6,
    }}
  >
    ✖
  </button>
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <ThemeProvider>
      <AuthProvider>
        <SnackbarProvider
          maxSnack={3}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          autoHideDuration={3000}
        >
          <>
            <AppRouter />
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              closeOnClick
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
              closeButton={customClose}
              toastStyle={{
                borderRadius: '8px',
                padding: '10px 16px',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                borderLeft: '5px solid #e74c3c',
                backgroundColor: '#fff',
                color: '#333',
                position: 'relative',
              }}
              bodyClassName={() => 'toast-body-custom'}
              progressStyle={{ height: '3px', borderRadius: '0 0 8px 8px' }}
            />
          </>
        </SnackbarProvider>
      </AuthProvider>
    </ThemeProvider>
  </Provider>
);
