import { BrowserRouter, Routes, Route } from "react-router-dom";
import Pricing from "./pages/Pricing";
import Dashboard from "./pages/Dashboard";  
import Header from "./components/Header";
import Courses from "./pages/Courses";
import CoursePage from "./pages/CoursePage";
import { AdminDashboard } from './pages/AdminDashboard';


function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<h1>Welcome to the App</h1>} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:slug" element={ <CoursePage />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;