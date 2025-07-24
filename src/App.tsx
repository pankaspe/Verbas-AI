// import { createSignal, onMount } from "solid-js";
// import { invoke } from "@tauri-apps/api/core";
import "./App.css";

import { TitleBar } from './components/TitleBar';
import { MainContent } from './components/MainContent';

function App() {
  return (
        <>
          <TitleBar />
          <div class="conteiner py-4">
            <MainContent />
          </div>
        </>
  );
}

export default App;
