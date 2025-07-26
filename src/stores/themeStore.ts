// src/stores/themeStore.ts
import { createSignal } from "solid-js";

// Leggi il tema salvato o fallback a 'forest'
const savedTheme = localStorage.getItem("theme") || "forest";
const [themeSignal, setThemeSignal] = createSignal<string>(savedTheme);

// Funzione per aggiornare segnale + DOM + storage
function setTheme(newTheme: string) {
  setThemeSignal(newTheme); // aggiorna signal
  localStorage.setItem("theme", newTheme); // salva in localStorage
  document.documentElement.setAttribute("data-theme", newTheme); // cambia tema sul <html>
}

// All'avvio applica il tema attuale
document.documentElement.setAttribute("data-theme", themeSignal());

export { themeSignal as theme, setTheme };
