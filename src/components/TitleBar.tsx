import { createSignal, onMount, onCleanup } from "solid-js";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { ThemeSwitcher } from "./ThemeSwitcher";
import {
  handleNewProject,
  handleOpenProject,
  handleSave,
  handleRepack
} from '../lib/projectActions';

import {  isEditorReady } from "../stores/editorStore";

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


  // JSX layout for title bar with dropdown menus and window controls
  return (
    <div class="navbar bg-base-300" style="-webkit-app-region: drag; min-height: 0rem;">
      <div class="navbar-start">
        <DropdownMenu label="File">
          <li>
            <button onClick={handleNewProject}>Create new project</button>
          </li>
          <hr class="border-t-1 border-base-100 my-2" />
          <li>
            <button onClick={handleOpenProject}>Open project</button>
          </li>
          <li><a>Recent project</a></li>
          <hr class="border-t-1 border-base-100 my-2" />
          <li>
            <button onClick={handleSave} disabled={!isEditorReady()}>Save</button>
          </li>
          <li>
            <button onClick={handleRepack}>Repack as .zip</button>
          </li>
          <hr class="border-t-1 border-base-100 my-2" />
          <li>
            <button onClick={closeWindow}>Exit</button>
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
          <ThemeSwitcher />
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
