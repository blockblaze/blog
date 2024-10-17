/* eslint-disable react/prop-types */
import { Sidebar } from "flowbite-react";
import { MdCreateNewFolder } from "react-icons/md";
import { PiSignOutBold } from "react-icons/pi";
import { IoIosContacts } from "react-icons/io";
import { Link } from "react-router-dom"




export function DashSidebar(props) {

  return (
<Sidebar  className="w-full md:w-56">
<Sidebar.Items >
<Sidebar.ItemGroup className="cursor-pointer">
    <Link to="/create-post">
    <Sidebar.Item icon={MdCreateNewFolder} active={props.location ==="create"}> 
        Create a post
    </Sidebar.Item>
    </Link>
    <Link to="/contacts">
    <Sidebar.Item icon={IoIosContacts} active={props.location ==="contacts"}>
        Manage Contacts
    </Sidebar.Item>
    </Link>
    <Sidebar.Item icon={PiSignOutBold}>
        Sign out
    </Sidebar.Item>
</Sidebar.ItemGroup>
</Sidebar.Items>
</Sidebar>
  );
}