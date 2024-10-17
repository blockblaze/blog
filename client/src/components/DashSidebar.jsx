/* eslint-disable react/prop-types */
import { Sidebar } from "flowbite-react";
import { MdCreateNewFolder } from "react-icons/md";
import { PiSignOutBold } from "react-icons/pi";
import { IoIosContacts } from "react-icons/io";
import { HiDocumentText } from "react-icons/hi";
import { FcStatistics } from "react-icons/fc";
import { Link } from "react-router-dom"




export function DashSidebar(props) {

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
    <Sidebar.Item icon={IoIosContacts} active={props.location ==="contacts"} as="div">
        Manage Contacts
    </Sidebar.Item>
    </Link>
    <Link to="/dashboard?tab=stats">
    <Sidebar.Item icon={FcStatistics} active={props.location ==="stats"} as="div"> 
    Statistics
    </Sidebar.Item>
    </Link>
    <Sidebar.Item icon={PiSignOutBold}  as="div">
        Sign out
    </Sidebar.Item>
</Sidebar.ItemGroup>
</Sidebar.Items>
</Sidebar>
  );
}