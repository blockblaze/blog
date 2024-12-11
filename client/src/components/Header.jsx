import { Button, Navbar, TextInput } from "flowbite-react"
import { Link , useLocation } from "react-router-dom"
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon , FaSun } from "react-icons/fa";
import { useSelector  , useDispatch } from "react-redux";
import { toggleTheme } from "../redux/theme/themeSlice";

function Header() {
    const path = useLocation().pathname;
    const dispatch = useDispatch();
    const {theme} = useSelector((state)=>state.theme)

    return (
      <>
     
      <Navbar className="border-b-2">
        {/*Logo */}
        <Link to="/" className="self-center whitespace-nowrap">
        <Navbar.Brand as={"div"}>
        <img src="/assets/full-logo.png" className="mr-3 h-8 sm:h-12" alt="Logo" />
      </Navbar.Brand>
        </Link>

        {/*Search form */}
        <form>
            <TextInput
            type="text"
            placeholder="Search..."
            rightIcon={AiOutlineSearch}
           className="hidden lg:inline input-focus"
            />
        </form>
        <Button className="w-12 h-10 lg:hidden" color="gray" pill>
            <AiOutlineSearch></AiOutlineSearch>
        </Button>
        <div className="flex gap-3 md:order-2">
            <Button className="w-12 h-10" color="gray" pill onClick={()=>dispatch(toggleTheme())}>
                {theme === "light"? <FaMoon/>:<FaSun/> }
            </Button>
            <Link to="/about">
            {/* <button className="bg-custom-orange text-white p-2 m:p-3 rounded hover:bg-custom-dark-orange font-medium hidden sm:inline">About</button> */}
                {/* <Button className="bg-custom-orange hover:!bg-custom-dark-orange">ABOUT ME</Button> */}
            </Link>
            <Navbar.Toggle/>
        </div>
        <Navbar.Collapse>
  <Navbar.Link
    active={path === "/"}
    className={path === "/" ? "!text-custom-dark-orange bg-inherit" : ""}
    as={'div'} // Use 'div' instead of 'a' for Navbar.Link
  >
    <Link to="/" className="hover:text-custom-dark-orange">
      Home
    </Link>
  </Navbar.Link>
  
  <Navbar.Link
    active={path === "/contact"}
    className={path === "/contact" ? "!text-custom-dark-orange bg-inherit" : ""}
    as={'div'} // Use 'div' instead of 'a'
  >
    <Link to="/contact" className="hover:text-custom-dark-orange">
      Contact
    </Link>
  </Navbar.Link>

  <Navbar.Link
    active={path === "/about"}
    className={path === "/about" ? "!text-custom-dark-orange bg-inherit" : ""}
    as={'div'} // Use 'div' instead of 'a'
  >
    <Link to="/about" className="hover:text-custom-dark-orange">
      About
    </Link>
  </Navbar.Link>


</Navbar.Collapse>


      </Navbar>
      </>
    )
  }
  
  export default Header