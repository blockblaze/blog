/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import Login from "../components/Login";
import { DashSidebar } from "../components/DashSidebar";
import { DashMain } from "../components/DashMain";
import { useLocation } from "react-router-dom";
import { CreatePost } from "../components/createPost";
import { DashPosts } from "../components/DashPosts";

function Dashboard() {
  const [isAuth , setIsAuth] = useState(false);
  const location = useLocation();
  const [tab, setTab] = useState('');
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  function handleLoginSuccess(){
    setIsAuth(true);
  }

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/dashboard")
        const data = await response.json();

        if(data.success){
          setIsAuth(true)
        }else{
          setIsAuth(false)
        }
            } catch (err) {
              setIsAuth(false);
      }
    };
    checkAuth();
  }, []);
    return (
      <>
  {isAuth ? (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* {Sidebar} */}
      <div className="md:w-56">
      <DashSidebar location={tab}/>
      </div>
      {tab === '' && <DashMain/>}
      {tab === 'create' && <CreatePost/>}
      {tab === 'posts' && <DashPosts/>}
      {tab === 'stats' && <DashMain/>}

    </div>
      ) : (
        <Login onLoginSuccess={handleLoginSuccess} />
      )}
      </>
    )
  }
  
  export default Dashboard;
  