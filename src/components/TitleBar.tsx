import { createSignal, onMount, onCleanup } from "solid-js";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { invoke } from '@tauri-apps/api/core';
import { open, save } from '@tauri-apps/plugin-dialog';
import { dirname, join } from "@tauri-apps/api/path";

import { project, setProject, ProjectConfig } from '../stores/projectStore'; 
import { loadAndCleanBaseChapter } from "../utils/loadCurrentHelper";
import { getMarkdown, isEditorReady } from "../stores/editorStore";

// DropdownMenu component for reusable dropdown menus with label and children
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
  // Track whether the window is maximized
  const [isMaximized, setIsMaximized] = createSignal(false);
  let window: Awaited<ReturnType<typeof getCurrentWindow>>;

  // Initialize window object and setup event listeners on mount
  onMount(async () => {
    window = await getCurrentWindow();
    setIsMaximized(await window.isMaximized());

    // Listen to window maximize, unmaximize, and resize events
    const unlistenMax = await window.listen("tauri://maximize", () => setIsMaximized(true));
    const unlistenUnmax = await window.listen("tauri://unmaximize", () => setIsMaximized(false));
    const unlistenResize = await window.listen("tauri://resize", async () => {
      setIsMaximized(await window.isMaximized());
    });

    // Cleanup listeners on unmount
    onCleanup(() => {
      unlistenMax();
      unlistenUnmax();
      unlistenResize();
    });
  });

  // Window control functions
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

  // Handler to create a new project
  const handleNewProject = async () => {
    // Show save dialog to select new project folder
    const folderPath = await save({
      title: "Create new project",
      defaultPath: "NewProject",
      filters: [],
    });
    if (!folderPath) return;

    // Extract project name from folder path (remove .verbas if present)
    const projectName = folderPath.split(/[\\/]/).pop()?.replace(/\.verbas$/, "") || "Project";

    // 1. Call backend to create project structure and base.md
    await invoke("create_new_project", {
      name: projectName,
      directory: folderPath.replace(/\\\\/g, "/"),
    });

    // 2. Load newly created project config
    const projectPath = `${folderPath}/${projectName}.verbas`;
    const newConfig = await invoke<ProjectConfig>("load_project", {
      path: projectPath,
    });

    // Update project store with new project data
    setProject({ config: newConfig, path: projectPath });

    // 3. Load base.md chapter into editor
    await loadAndCleanBaseChapter();

    console.log("New project created and base.md loaded.");
  };

  // Handler to open an existing project
  const handleOpenProject = async () => {
    // Open dialog to select a .verbas project file
    const selected = await open({ multiple: false, filters: [{ name: "Verbas Project", extensions: ["verbas"] }] });
    if (selected && typeof selected === 'string') {
      const config = await invoke<ProjectConfig>("load_project", { path: selected });
      setProject({ config, path: selected });

      // After loading project config, load base.md chapter
      await loadAndCleanBaseChapter();

      console.log("Loaded project:", config);
    }
  };

  // Handler to save current project and base.md file
  const handleSave = async () => {
    if (!project.path || !project.config) {
      console.warn("No project loaded.");
      return;
    }

    try {
      // Get markdown content from editor
      const markdownContent = await getMarkdown();
      console.log("Markdown content to save:", markdownContent);

      if (!markdownContent) {
        console.warn("Markdown content is empty or editor not ready.");
        return;
      }

      // Construct path to base.md inside chapters folder
      const baseDir = await dirname(project.path);
      const chaptersDir = await join(baseDir, project.config.structure.chapters_path);
      const baseMdPath = await join(chaptersDir, "base.md");

      // Save markdown content to base.md file via backend
      await invoke("save_markdown_file", { path: baseMdPath, content: markdownContent });

      // Save project configuration file
      await invoke("save_project", {
        path: project.path,
        config: project.config,
      });

      console.log("Project and base.md saved.");
    } catch (error) {
      console.error("Error saving project or base.md:", error);
    }
  };

  // Handler to clone the current project to a new folder
  async function handleClone() {
    // Open dialog to select target folder for cloning
    const targetDir = await open({
      title: "Select destination folder",
      directory: true,
    });

    if (!targetDir || typeof targetDir !== "string") return;

    try {
      // Call Rust backend to clone the project directory
      const newPath = await invoke<string>("clone_project", {
        originalPath: project.path,
        newFolderPath: targetDir,
      });

      // Verify returned path is valid string
      if (!newPath || typeof newPath !== "string") {
        throw new Error("clone_project did not return a valid path");
      }

      // Load configuration from cloned project
      const newConfig = await invoke<ProjectConfig>("load_project", {
        path: newPath,
      });

      // Update project store with cloned project data
      setProject({ path: newPath, config: newConfig });

      // Load base.md chapter for new project
      await loadAndCleanBaseChapter();

      console.log("Project cloned and loaded from:", newPath);
    } catch (e) {
      console.error("Error in Save As:", e);
    }
  }

  // JSX layout for title bar with dropdown menus and window controls
  return (
    <div class="navbar bg-base-300" style="-webkit-app-region: drag; min-height: 0rem;">
      <div class="navbar-start">
        <DropdownMenu label="File">
          <li>
            <a onClick={handleNewProject}>Create new project</a>
          </li>
          <hr class="border-t-1 border-base-100 my-2" />
          <li>
            <a onClick={handleOpenProject}>Open project</a>
          </li>
          <li><a>Recent project</a></li>
          <hr class="border-t-1 border-base-100 my-2" />
          <li>
            <button onClick={handleSave} disabled={!isEditorReady()}>Save</button>
          </li>
          <li>
            <a onClick={handleClone}>Clone project in...</a>
          </li>
          <hr class="border-t-1 border-base-100 my-2" />
          <li>
            <a onClick={closeWindow}>Exit</a>
          </li>
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
