import { BrowserRouter, Routes, Route } from "react-router-dom";
import Pricing from "./pages/Pricing";
import Header from "./components/Header";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<h1>Welcome to the App</h1>} />
        <Route path="/pricing" element={<Pricing />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;