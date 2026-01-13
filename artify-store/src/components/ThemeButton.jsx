import theme1 from "../assets/icons/theme1.svg";
import theme2 from "../assets/icons/theme2.svg";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

export default function ThemeButton() {
    const { theme, toggleTheme } = useContext(ThemeContext);

  return (
     <>
      <button onClick={toggleTheme} className="theme-btn">
          {theme === "dark" ? <img src={theme2} alt="Theme 2" className="theme-icon" /> : <img src={theme1} alt="Theme 1" className="theme-icon" />}
      </button>
    </>
  );
}