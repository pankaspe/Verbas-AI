// stores/sidebarStore.ts
import { createSignal } from "solid-js";

export const [openPanel, setOpenPanel] = createSignal<"file" | "chat" | null>(null);


