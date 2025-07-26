// components/MilkdownEditor.tsx
import { onCleanup, createEffect } from "solid-js";
import { Crepe } from "@milkdown/crepe";
import { setEditorInstance, setIsEditorReady } from "../stores/editorStore";
import { theme } from "../stores/themeStore";

import "@milkdown/crepe/theme/common/style.css"; // solo il comune, sempre

type MilkdownEditorProps = { initialValue: string };

export default function MilkdownEditor(props: MilkdownEditorProps) {
  let containerRef!: HTMLDivElement;
  let crepeInstance: Crepe | null = null;

  // Mantieni riferimento all'ultimo link caricato
  let currentThemeLink: HTMLLinkElement | null = null;

  // Carica dinamicamente il CSS del tema
  function loadThemeCSS(themeName: string) {
    const newLink = document.createElement("link");
    newLink.rel = "stylesheet";
    newLink.type = "text/css";
    newLink.href = `/styles/milkdown-teme-${themeName}.css`;
    newLink.dataset.milkdownTheme = themeName;

    newLink.onload = () => {
      // Quando il nuovo tema è pronto, rimuovi il vecchio
      if (currentThemeLink) {
        currentThemeLink.remove();
      }
      currentThemeLink = newLink;
    };

    // Aggiungi subito il nuovo (ma senza rimuovere il vecchio per ora)
    document.head.appendChild(newLink);
  }

  createEffect(() => {
    const selectedTheme = theme();
    loadThemeCSS(selectedTheme);

    if (crepeInstance) {
      crepeInstance.destroy();
      crepeInstance = null;
    }

    crepeInstance = new Crepe({
      root: containerRef,
      defaultValue: props.initialValue || "",
    });

    crepeInstance.create().then(() => {
      setEditorInstance(crepeInstance!);
      setIsEditorReady(true);
    });
  });

  onCleanup(() => {
    if (crepeInstance) {
      crepeInstance.destroy();
      crepeInstance = null;
    }
    if (currentThemeLink) {
      currentThemeLink.remove();
    }
  });

  return (
    <div class="milkdown-frame">
      <div ref={containerRef} />
    </div>
  );
}
