import { createSignal, createEffect } from "solid-js";
import MilkdownEditor from "./MilkdownEditor";
import { loadAndCleanBaseChapter } from "../utils/loadCurrentHelper";

export function MainContent() {
  const [markdown, setMarkdown] = createSignal("");

  createEffect(async () => {
    const cleanedMd = await loadAndCleanBaseChapter();
    if (cleanedMd !== null) {
      setMarkdown(cleanedMd);
    } else {
      setMarkdown("### Errore nel caricamento del file base.md");
    }
  });

  return (
    <div class="container mx-auto">
      <MilkdownEditor initialValue={markdown()} />
    </div>
  );
}
