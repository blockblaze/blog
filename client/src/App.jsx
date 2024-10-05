import {BrowserRouter , Routes , Route} from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Privacy from "./pages/Privacy";
import Content from "./pages/Content";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFount";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <>
  <BrowserRouter>
  <Routes>
    <Route path="/" element={<Home/>}/>
    <Route path="/about" element={<About/>}/>
    <Route path="/privacy" element={<Privacy/>}/>
    <Route path="/content" element={<Content/>}/>
    <Route path="/contact" element={<Contact/>}/>
    <Route path="/dashboard" element={<Dashboard/>}/>
    <Route path="*" element={<NotFound/>}/>
  </Routes>
  </BrowserRouter>
    </>
  )
}

export default App
