import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import StartPage from "./components/start-page/StartPage";

function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="" element={<StartPage />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;
