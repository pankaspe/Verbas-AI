// components/MilkdownEditor.tsx
import { onMount } from "solid-js";
import { Crepe } from "@milkdown/crepe";

import "@milkdown/crepe/theme/common/style.css";
import "../styles/milkdown-teme.css";

export default function MilkdownEditor() {
  let containerRef!: HTMLDivElement;

  onMount(() => {
    const crepe = new Crepe({
      root: containerRef,
      defaultValue: "# Benvenuto in Milkdown + Solid!",
    });

    crepe.create();
  });

  return (
    <div class="milkdown-frame">
      <div ref={containerRef} />
    </div>
  );
}
