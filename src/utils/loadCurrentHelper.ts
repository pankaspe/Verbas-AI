import { invoke } from "@tauri-apps/api/core";
import { dirname, join } from "@tauri-apps/api/path";
import { project } from "../stores/projectStore";

export async function loadAndCleanBaseChapter(): Promise<string | null> {
  const current = project;
  if (!current.path || !current.config) return null;

  try {
    const baseDir = await dirname(current.path);
    const chaptersDir = await join(baseDir, current.config.structure.chapters_path);
    const baseMdPath = await join(chaptersDir, "base.md");

    console.log("Tentativo di caricare base.md da:", baseMdPath);

    const markdown = await invoke<string>("load_markdown_file", { path: baseMdPath });
    if (!markdown) return null;

    // Rimuovi frontmatter TOML delimitato da +++
    const cleanedMarkdown = markdown.replace(/^\+\+\+\r?\n[\s\S]*?\r?\n\+\+\+\r?\n?/, "");

    return cleanedMarkdown;
  } catch (err) {
    console.error("Errore nel caricamento di base.md:", err);
    return null;
  }
}
