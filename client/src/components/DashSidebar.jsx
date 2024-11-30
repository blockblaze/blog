/* eslint-disable react/prop-types */
import { Sidebar } from "flowbite-react";
import { MdCreateNewFolder } from "react-icons/md";
import { PiSignOutBold } from "react-icons/pi";
import { HiDocumentText , HiAnnotation } from "react-icons/hi";
import { FcStatistics } from "react-icons/fc";
import { Link } from "react-router-dom"




export function DashSidebar(props) {


    const handleSignout = async () => {
        try {
            const res = await fetch('/api/signout', {
              method: 'POST',
            });
            const data = await res.json();
            if (!res.ok) {
              console.log(data.message);
            }
            window.location.reload();
          } catch (error) {
            console.log(error.message);
          }
    };

  return (
<Sidebar  className="w-full md:w-56">
<Sidebar.Items >
<Sidebar.ItemGroup className="cursor-pointer flex flex-col gap-1">
    <Link to="/dashboard?tab=create">
    <Sidebar.Item icon={MdCreateNewFolder} active={props.location ==="create"} as="div"> 
        Create a post
    </Sidebar.Item>
    </Link>
    <Link to="/dashboard?tab=posts">
    <Sidebar.Item icon={HiDocumentText} active={props.location ==="posts"} as="div">
        Posts
    </Sidebar.Item>
    </Link>
    <Link to="/dashboard?tab=contacts">
    <Sidebar.Item icon={HiAnnotation} active={props.location ==="contacts"} as="div">
        Contacts & Feedbacks
    </Sidebar.Item>
    </Link>
    <Link to="/dashboard?tab=stats">
    <Sidebar.Item icon={FcStatistics} active={props.location ==="stats"} as="div"> 
    Statistics
    </Sidebar.Item>
    </Link>
    <Sidebar.Item icon={PiSignOutBold}  as="div" onClick={handleSignout}>
        Sign out
    </Sidebar.Item>
</Sidebar.ItemGroup>
</Sidebar.Items>
</Sidebar>
  );
}