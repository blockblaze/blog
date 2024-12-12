import {BrowserRouter , Routes , Route} from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Privacy from "./pages/Privacy";
import Content from "./pages/Content";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFount";
import Dashboard from "./pages/Dashboard";
import Header from "./components/Header";
import FooterCom from "./components/Footer";
import Post from "./pages/Post"
import Search from "./pages/Search";

function App() {
  return (
    <>
  <BrowserRouter>
  <Header></Header>
  <Routes>
    <Route path="/" element={<Home/>}/>
    <Route path="/about" element={<About/>}/>
    <Route path="/search" element={<Search/>}/>
    <Route path="/privacy" element={<Privacy/>}/>
    <Route path="/content" element={<Content/>}/>
    <Route path="/contact" element={<Contact/>}/>
    <Route path="/dashboard" element={<Dashboard/>}/>
    <Route path="/post/:postSlug" element={<Post/>}/>
    <Route path="*" element={<NotFound/>}/>
  </Routes>
  <FooterCom></FooterCom>
  </BrowserRouter>
    </>
  )
}

export default App

