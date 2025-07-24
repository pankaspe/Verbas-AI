import { createSignal, onMount, onCleanup } from "solid-js";
import { getCurrentWindow } from "@tauri-apps/api/window";

// DropdownMenu component for the top navbar
function DropdownMenu(props: {
  label: string;
  children: any;
}) {
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

// TitleBar component for the Tauri window
export function TitleBar() {
  const [isMaximized, setIsMaximized] = createSignal(false);
  let window: Awaited<ReturnType<typeof getCurrentWindow>>;

  onMount(async () => {
    window = await getCurrentWindow();

    // Set initial maximized state
    setIsMaximized(await window.isMaximized());

    // Listen to maximize/unmaximize events
    const unlistenMax = await window.listen("tauri://maximize", () =>
      setIsMaximized(true)
    );
    const unlistenUnmax = await window.listen("tauri://unmaximize", () =>
      setIsMaximized(false)
    );

    // Listen to resize events (e.g., double-click on title bar)
    const unlistenResize = await window.listen("tauri://resize", async () => {
      setIsMaximized(await window.isMaximized());
    });

    // Cleanup event listeners when the component unmounts
    onCleanup(() => {
      unlistenMax();
      unlistenUnmax();
      unlistenResize();
    });
  });

  // Minimize window
  const minimize = async () => {
    await window.minimize();
  };

  // Toggle maximize/unmaximize window
  const toggleMaximize = async () => {
    if (isMaximized()) {
      await window.unmaximize();
      setIsMaximized(false);
    } else {
      await window.maximize();
      setIsMaximized(true);
    }
  };

  // Close window
  const closeWindow = async () => {
    await window.close();
  };

  return (
    <div class="navbar bg-base-300" style="-webkit-app-region: drag; min-height: 0rem;">
      {/* Left section: Dropdown menus */}
      <div class="navbar-start">
        <DropdownMenu label="File">
          <li><a>New document</a></li>
          <hr class="border-t-1 border-base-100 my-2" />
          <li><a>Open document</a></li>
          <li><a>Open recent</a></li>
          <hr class="border-t-1 border-base-100 my-2" />
          <li><a>Save</a></li>
          <li><a>Save as</a></li>
          <hr class="border-t-1 border-base-100 my-2" />
          <li><a>Exit</a></li>
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

      {/* Center section: Logo */}
      <div class="navbar-center">
        <div class="font-bold text-lg">
          Ve<span class="text-secondary">r</span>ba<span class="text-secondary">s</span>
        </div>
      </div>


      {/* Right section: Window controls */}
      <div class="navbar-end">
        <div style="-webkit-app-region: no-drag; user-select: none;">
          <button class="btn btn-ghost btn-xs" onClick={minimize}>–</button>
          <button class="btn btn-ghost btn-xs" onClick={toggleMaximize}>
            {isMaximized() ? "🗗" /* Restore */ : "☐" /* Maximize */}
          </button>
          <button class="btn btn-ghost btn-xs btn-error" onClick={closeWindow}>✕</button>
        </div>
      </div>
    </div>
  );
}
