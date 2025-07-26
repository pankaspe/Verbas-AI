import "./App.css";

import { TitleBar } from './components/TitleBar';
import { MainContent } from './components/MainContent';

function App() {

  return (
        <>
          <TitleBar />
          <div>            
            <MainContent />
          </div>
        </>
  );
}

export default App;
