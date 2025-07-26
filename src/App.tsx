import "./App.css";

import { onMount } from "solid-js";
import { TitleBar } from './components/TitleBar';
import { MainContent } from './components/MainContent';
import { theme } from "./stores/themeStore";

function App() {

  onMount(() => {
    document.documentElement.setAttribute("data-theme", theme());
  });

  return (
        <>
          <TitleBar />
          <div class="min-h-screen flex">            
            <MainContent />
          </div>
        </>
  );
}

export default App;
