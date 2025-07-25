import { createSignal } from "solid-js";
import type { Crepe } from "@milkdown/crepe";

const [editorInstance, setEditorInstance] = createSignal<Crepe | null>(null);
const [isEditorReady, setIsEditorReady] = createSignal(false);

export { editorInstance, setEditorInstance, isEditorReady, setIsEditorReady };

// ✅ Funzione per ottenere il contenuto markdown
export async function getMarkdown(): Promise<string | null> {
  const editor = editorInstance();
  if (!editor) {
    console.warn("Editor non pronto per leggere il contenuto.");
    return null;
  }

  try {
    const markdown = await editor.getMarkdown();
    return markdown;
  } catch (e) {
    console.error("Errore leggendo il markdown dall'editor:", e);
    return null;
  }
}

// ❗ Non esiste setMarkdown ufficiale in Crepe — quindi la funzione sotto è *custom*
// Usiamo una `@ts-ignore` per forzare l'uso interno del context
export async function setMarkdown(content: string) {
  const editor = editorInstance();
  if (editor) {
    // @ts-ignore: accesso diretto non documentato, usalo con cautela
    await editor.editor.action((ctx: any) => {
      ctx.set("doc", content);
    });
  }
}
