export function Sidebar() {
  return (
    <ul class="menu bg-base-200 rounded-box w-56 p-2 text-sm">
      
      {/* Database Connections */}
      <li>
        <h2 class="menu-title">Database</h2>
        <ul>
          <li>
            <a>
              {/* Icona: Connection */}
              <svg xmlns="http://www.w3.org/2000/svg" class="size-4 me-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8s-9-3.582-9-8 4.03-8 9-8 9 3.582 9 8Z" />
              </svg>
              Connections
            </a>
          </li>
          <li>
            <a>
              {/* Icona: Tables & Views */}
              <svg xmlns="http://www.w3.org/2000/svg" class="size-4 me-2" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 6.75A2.25 2.25 0 015.25 4.5h13.5A2.25 2.25 0 0121 6.75v1.5A2.25 2.25 0 0118.75 10.5H5.25A2.25 2.25 0 013 8.25v-1.5zM3 13.5A2.25 2.25 0 015.25 11.25h13.5A2.25 2.25 0 0121 13.5v1.5a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15v-1.5z" />
              </svg>
              Tables & Views
            </a>
          </li>
          <li>
            <a>
              {/* Icona: AI Inspector */}
              <svg xmlns="http://www.w3.org/2000/svg" class="size-4 me-2" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 15l3.536 3.536M21 21l-3.536-3.536M12 5.25c3.866 0 7 2.91 7 6.5s-3.134 6.5-7 6.5-7-2.91-7-6.5 3.134-6.5 7-6.5Z" />
              </svg>
              AI Inspector
            </a>
          </li>
        </ul>
      </li>


      {/* Query Tools */}
      <li>
        <h2 class="menu-title">Query</h2>
        <ul>
          <li>
            <a>
              <svg xmlns="http://www.w3.org/2000/svg" class="size-4 me-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Query Editor
            </a>
          </li>
          <li>
            <a>
              <svg xmlns="http://www.w3.org/2000/svg" class="size-4 me-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M3 14h18" />
              </svg>
              Results
            </a>
          </li>
        </ul>
      </li>

      {/* Import & Plugins */}
      <li>
        <h2 class="menu-title">Tools</h2>
        <ul>
          <li>
            <a>
              <svg xmlns="http://www.w3.org/2000/svg" class="size-4 me-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Import Data
            </a>
          </li>
          <li>
            <a>
              <svg xmlns="http://www.w3.org/2000/svg" class="size-4 me-2" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 17v2a1 1 0 001 1h4a1 1 0 001-1v-2M12 12v5m8-7a8 8 0 11-16 0 8 8 0 0116 0z" />
              </svg>
              Export As
            </a>
          </li>
          <li>
            <a>
              <svg xmlns="http://www.w3.org/2000/svg" class="size-4 me-2" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 3v2.25M12.75 3v2.25M9 7.5h6m-6 3h6m-6 3h4.5m-4.5 3h6m-6 3h6M3.75 7.5h.008v.008H3.75V7.5zM3.75 10.5h.008v.008H3.75V10.5zM3.75 13.5h.008v.008H3.75V13.5zM3.75 16.5h.008v.008H3.75V16.5zM3.75 19.5h.008v.008H3.75V19.5z" />
              </svg>
              Analytics
            </a>
          </li>
          <li>
            <a>
              <svg xmlns="http://www.w3.org/2000/svg" class="size-4 me-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 4.5L12 3l2.25 1.5v3l2.25 1.5v3l2.25 1.5v3L12 21l-6.75-4.5v-3l2.25-1.5v-3l2.25-1.5v-3z" />
              </svg>
              Plugins
            </a>
          </li>
        </ul>
      </li>

    </ul>
  );
}
