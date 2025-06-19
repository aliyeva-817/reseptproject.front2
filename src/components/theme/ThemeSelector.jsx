import { useContext } from "react";
import { ThemeContext } from "./ThemeContext";

const themes = [
  { name: "lemon", label: "🍋 Lemon" },
  { name: "avocado", label: "🥑 Avocado" },
  { name: "strawberry", label: "🍓 Strawberry" },
  { name: "grape", label: "🍇 Grape" },
];

const ThemeSelector = () => {
  const { theme, setTheme } = useContext(ThemeContext);

  return (
    <div>
      <h4>Temanı Seç:</h4>
      {themes.map((t) => (
        <button
          key={t.name}
          onClick={() => setTheme(t.name)}
          style={{
            margin: "3px",
            padding: "5px 10px",
            backgroundColor: theme === t.name ? "#ccc" : "#f5f5f5",
            borderRadius: "10px",
            border: "1px solid #ccc",
            cursor: "pointer",
          }}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
};

export default ThemeSelector;
