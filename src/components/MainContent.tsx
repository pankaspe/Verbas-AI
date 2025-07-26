import { createSignal, createEffect } from "solid-js";
import MilkdownEditor from "./MilkdownEditor";
import { Sidebar } from "./Sidebar";
import { FileBrowser } from "./FileBrowser";
import { ChatPanel } from "./ChatPanel";
import { openPanel } from "../stores/sidebarStore";
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
<div class="h-screen w-screen flex overflow-hidden">

      {/* Sidebar fissa a sinistra */}
      <div class="w-16 bg-base-300 h-full shrink-0">
        <Sidebar />
      </div>

      {/* Area contenuti a destra (pannelli + editor) */}
      <div class="flex-1 flex h-full overflow-hidden">

        {/* Pannello file */}
        <div
          class={`transition-all duration-300 ease-in-out overflow-hidden ${
            openPanel() === "file" ? "w-64" : "w-0"
          }`}
        >
          <div class="h-full bg-base-100 border-l border-base-300">
            {openPanel() === "file" && <FileBrowser />}
          </div>
        </div>

        {/* Pannello chat */}
        <div
          class={`transition-all duration-300 ease-in-out overflow-hidden ${
            openPanel() === "chat" ? "w-64" : "w-0"
          }`}
        >
          <div class="h-full bg-base-100 border-l border-base-300">
            {openPanel() === "chat" && <ChatPanel />}
          </div>
        </div>

        {/* Editor scrollabile */}
        <div class="flex-1 flex items-start h-full overflow-hidden">
          <div class="w-full h-full overflow-y-auto px-4 py-6 relative">

            {/* Alert */}
            <div
              id="alert"
              role="alert"
              class="hidden absolute top-4 left-1/2 -translate-x-1/2 z-50 min-w-[500px] max-w-xl px-6 py-4"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span id="alert-message"></span>
            </div>

            <MilkdownEditor initialValue={markdown()} />
          </div>
        </div>

      </div>
    </div>
  );
}
