// ThemeSwitcher.tsx
import { theme, setTheme } from "../stores/themeStore";

export function ThemeSwitcher() {
  const themes = ["forest", "nord"];

  function handleChange(t: string) {
    setTheme(t);
  }

  return (
    <li class="dropdown dropdown-right">
      <div tabindex="0" role="button" class="btn btn-ghost btn-sm">
        Switch theme
            <svg
            class="ml-2 w-3 h-3 fill-current"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            >
            <path d="M7 5.5l4.5 4.5L7 14.5v-9z" />
            </svg>
      </div>

      <ul
        tabindex="0"
        class="menu menu-sm dropdown-content bg-base-300 rounded-sm z-1 mt-1 w-52 p-2 border border-base-100"
      >
        {themes.map((t) => (
          <li>
            <a
              class={theme() === t ? "active font-bold" : ""}
              onClick={() => handleChange(t)}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </a>
          </li>
        ))}
      </ul>
    </li>
  );
}
