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

            <div id="alert" role="alert" class="hidden absolute top-14 left-1/2 -translate-x-1/2 z-50 min-w-[500px] max-w-xl px-6 py-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span id="alert-message"></span>
            </div>

      <MilkdownEditor initialValue={markdown()} />
    </div>
  );
}
