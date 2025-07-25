// stores/projectStore.ts
import { createStore } from "solid-js/store";
import { createSignal } from "solid-js";

export type ProjectConfig = {
  name: string;
  version: number;
  created_at: string;
  updated_at: string;
  editor: {
    font_family: string;
    font_size: number;
    theme: string;
    line_spacing: number;
  };
  structure: {
    chapters_path: string;
    images_path: string;
    fonts_path: string;
    style_path: string;
    exports_path: string;
    notes_path: string;
  };
  chapters: Array<any>; // puoi tipizzare meglio dopo
  metadata: {
    author: string;
    language: string;
    tags: string[];
    cover_image: string;
  };
};

// Reactive store per il progetto corrente
const [project, setProject] = createStore({
  config: null as ProjectConfig | null,
  path: "" as string,
});

// editorRef come Signal per tenere il riferimento DOM dell'editor
const [editorRef, setEditorRef] = createSignal<HTMLDivElement | null>(null);

export { project, setProject, editorRef, setEditorRef };