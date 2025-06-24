import ReactDOM from "react-dom/client";
import AppRouter from "./router/Router";
import { Provider } from "react-redux";
import store from "./redux/store";
import { ThemeProvider } from "./components/theme/ThemeContext";
import { AuthProvider } from "./context/AuthContext"; // Yeni

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <ThemeProvider>
      <AuthProvider> {/* Auth konteksti */}
        <AppRouter />
      </AuthProvider>
    </ThemeProvider>
  </Provider>
);
