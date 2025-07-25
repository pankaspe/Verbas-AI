import { createSignal, onMount, onCleanup } from "solid-js";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { invoke } from '@tauri-apps/api/core';
import { open, save } from '@tauri-apps/plugin-dialog';
import { dirname, join } from "@tauri-apps/api/path";

import { project, setProject, ProjectConfig } from '../stores/projectStore'; 
import { loadAndCleanBaseChapter } from "../utils/loadCurrentHelper";
import { getMarkdown, isEditorReady } from "../stores/editorStore";

function DropdownMenu(props: { label: string; children: any }) {
  return (
    <div class="dropdown">
      <div tabindex="0" role="button" class="btn btn-ghost btn-sm">
        {props.label}
      </div>
      <ul
        tabindex="0"
        class="menu menu-sm dropdown-content bg-base-300 rounded-sm z-1 mt-1 w-52 p-2 border border-base-100"
      >
        {props.children}
      </ul>
    </div>
  );
}

export function TitleBar() {
  const [isMaximized, setIsMaximized] = createSignal(false);
  let window: Awaited<ReturnType<typeof getCurrentWindow>>;

  onMount(async () => {
    window = await getCurrentWindow();
    setIsMaximized(await window.isMaximized());

    const unlistenMax = await window.listen("tauri://maximize", () => setIsMaximized(true));
    const unlistenUnmax = await window.listen("tauri://unmaximize", () => setIsMaximized(false));
    const unlistenResize = await window.listen("tauri://resize", async () => {
      setIsMaximized(await window.isMaximized());
    });

    onCleanup(() => {
      unlistenMax();
      unlistenUnmax();
      unlistenResize();
    });
  });

  const minimize = async () => await window.minimize();
  const toggleMaximize = async () => {
    if (isMaximized()) {
      await window.unmaximize();
      setIsMaximized(false);
    } else {
      await window.maximize();
      setIsMaximized(true);
    }
  };
  const closeWindow = async () => await window.close();

  const handleNewProject = async () => {
    const folderPath = await save({
      title: "Crea nuovo progetto",
      defaultPath: "NuovoProgetto",
      filters: [],
    });
    if (!folderPath) return;

    const projectName = folderPath.split(/[\\/]/).pop()?.replace(/\.verbas$/, "") || "Progetto";

    // 1. Crea struttura progetto + base.md dal backend
    await invoke("create_new_project", {
      name: projectName,
      directory: folderPath.replace(/\\\\/g, "/"),
    });

    // 2. Carica il progetto appena creato
    const projectPath = `${folderPath}/${projectName}.verbas`;
    const newConfig = await invoke<ProjectConfig>("load_project", {
      path: projectPath,
    });

    setProject({ config: newConfig, path: projectPath });

    // ✅ 3. Carica base.md nell’editor
    await loadAndCleanBaseChapter();

    console.log("Nuovo progetto creato, base.md caricato.");
  };

  const handleOpenProject = async () => {
    const selected = await open({ multiple: false, filters: [{ name: "Verbas Project", extensions: ["verbas"] }] });
    if (selected && typeof selected === 'string') {
      const config = await invoke<ProjectConfig>("load_project", { path: selected });
      setProject({ config, path: selected });

      // ✅ Dopo aver caricato il progetto, carica base.md
      await loadAndCleanBaseChapter();

      console.log("Loaded project:", config);
    }
  };

  const handleSave = async () => {
  if (!project.path || !project.config) {
    console.warn("No project loaded.");
    return;
  }

  try {
    const markdownContent = await getMarkdown();
    console.log("Contenuto Markdown da salvare:", markdownContent);

    if (!markdownContent) {
      console.warn("Contenuto markdown vuoto o editor non pronto.");
      return;
    }

    const baseDir = await dirname(project.path);
    const chaptersDir = await join(baseDir, project.config.structure.chapters_path);
    const baseMdPath = await join(chaptersDir, "base.md");

    await invoke("save_markdown_file", { path: baseMdPath, content: markdownContent });

    await invoke("save_project", {
      path: project.path,
      config: project.config,
    });

    console.log("Progetto e base.md salvati.");
  } catch (error) {
    console.error("Errore nel salvataggio progetto o base.md:", error);
  }
};

  const handleSaveAs = async () => {
    if (!project.config) return;

    const newPath = await save({
      title: "Salva progetto come...",
      defaultPath: `${project.config.name}.verbas`,
      filters: [{ name: "Verbas Project", extensions: ["verbas"] }],
    });
    if (!newPath) return;

    try {
      await invoke("save_project_as", {
        newPath,
        config: project.config,
      });
      setProject({ config: project.config, path: newPath });
      console.log("Progetto salvato come:", newPath);
    } catch (error) {
      console.error("Errore nel save as:", error);
    }
  };

  return (
    <div class="navbar bg-base-300" style="-webkit-app-region: drag; min-height: 0rem;">
      <div class="navbar-start">
        <DropdownMenu label="File">
          <li><a onClick={handleNewProject}>Create new project</a></li>
          <hr class="border-t-1 border-base-100 my-2" />
          <li><a onClick={handleOpenProject}>Open project</a></li>
          <li><a>Recent project</a></li>
          <hr class="border-t-1 border-base-100 my-2" />
          <li><button onClick={handleSave} disabled={!isEditorReady()}>Save project</button></li>
          <li><a onClick={handleSaveAs}>Save project as...</a></li>
          <hr class="border-t-1 border-base-100 my-2" />
          <li><a onClick={closeWindow}>Exit</a></li>
        </DropdownMenu>

        <DropdownMenu label="Edit">
          <li><a>Undo</a></li>
          <li><a>Redo</a></li>
          <hr class="border-t-1 border-base-100 my-2" />
          <li><a>Cut</a></li>
          <li><a>Copy</a></li>
          <li><a>Paste</a></li>
          <hr class="border-t-1 border-base-100 my-2" />
          <li><a>Find and replace</a></li>
        </DropdownMenu>

        <DropdownMenu label="View">
          <li><a>Preview</a></li>
          <li><a>Editor layout</a></li>
          <hr class="border-t-1 border-base-100 my-2" />
          <li><a>Analytics</a></li>
          <hr class="border-t-1 border-base-100 my-2" />
          <li><a>Terminal</a></li>
          <li><a>Debug</a></li>
        </DropdownMenu>

        <DropdownMenu label="Settings">
          <li><a>AI models</a></li>
          <hr class="border-t-1 border-base-100 my-2" />
          <li><a>Preferences</a></li>
          <li><a>Account</a></li>
        </DropdownMenu>
      </div>

      <div class="navbar-center">
        <div class="font-bold text-lg">
          Ve<span class="text-secondary">r</span>ba<span class="text-secondary">s</span>
        </div>
      </div>

      <div class="navbar-end">
        <div style="-webkit-app-region: no-drag; user-select: none;">
          <button class="btn btn-ghost btn-xs" onClick={minimize}>–</button>
          <button class="btn btn-ghost btn-xs" onClick={toggleMaximize}>
            {isMaximized() ? "🗗" : "☐"}
          </button>
          <button class="btn btn-ghost btn-xs btn-error" onClick={closeWindow}>✕</button>
        </div>
      </div>
    </div>
  );
}
