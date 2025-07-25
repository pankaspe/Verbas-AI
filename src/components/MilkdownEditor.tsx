import { onCleanup, createEffect } from "solid-js";
import { Crepe } from "@milkdown/crepe";
import { setEditorInstance, setIsEditorReady } from "../stores/editorStore";

import "@milkdown/crepe/theme/common/style.css";
import "../styles/milkdown-teme.css";

type MilkdownEditorProps = { initialValue: string };

export default function MilkdownEditor(props: MilkdownEditorProps) {
  let containerRef!: HTMLDivElement;
  let crepeInstance: Crepe | null = null;

  createEffect(() => {
    // Se c'è un'istanza vecchia, la distruggo
    if (crepeInstance) {
      crepeInstance.destroy();  // distrugge editor e pulisce DOM
      crepeInstance = null;
    }

    crepeInstance = new Crepe({
      root: containerRef,
      defaultValue: props.initialValue || "",
    });

    crepeInstance.create().then(() => {
      setEditorInstance(crepeInstance!)
      setIsEditorReady(true);
    });
  });

  // Quando il componente si smonta, distruggo l'istanza
  onCleanup(() => {
    if (crepeInstance) {
      crepeInstance.destroy();
      crepeInstance = null;
    }
  });

  return (
    <div class="milkdown-frame">
      <div ref={containerRef} />
    </div>
  );
}
