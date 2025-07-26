// components/MilkdownEditor.tsx
import { onCleanup, createEffect } from "solid-js";
import { Crepe } from "@milkdown/crepe";
import { setEditorInstance, setIsEditorReady } from "../stores/editorStore";
import { theme } from "../stores/themeStore";

import "@milkdown/crepe/theme/common/style.css";

type MilkdownEditorProps = { initialValue: string };

export default function MilkdownEditor(props: MilkdownEditorProps) {
  let containerRef!: HTMLDivElement;
  let crepeInstance: Crepe | null = null;

  let styleLink: HTMLLinkElement | null = null;

  function loadThemeCSS(themeName: string) {
    // Pulisce eventuale CSS precedente
    if (styleLink) {
      styleLink.remove();
      styleLink = null;
    }

    // Crea il nuovo link al file CSS
    styleLink = document.createElement("link");
    styleLink.rel = "stylesheet";
    styleLink.type = "text/css";
    styleLink.href = `/styles/milkdown-teme-${themeName}.css`; // usa il nome del tema

    document.head.appendChild(styleLink);
  }

  createEffect(() => {
    // Cambia CSS quando cambia il tema
    loadThemeCSS(theme());

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
    if (styleLink) {
      styleLink.remove();
    }
  });

  return (
    <div class="milkdown-frame">
      <div ref={containerRef} />
    </div>
  );
}
