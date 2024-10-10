import { Button, Navbar, TextInput } from "flowbite-react"
import { Link , useLocation } from "react-router-dom"
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon } from "react-icons/fa";

function Header() {
    const path = useLocation().pathname;

    return (
      <>
     
      <Navbar className="border-b-2">
        {/*Logo */}
        <Link to="/" className="self-center whitespace-nowrap">
        <Navbar.Brand as={"div"}>
        <img src="/assets/full-logo.png" className="mr-3 h-9 sm:h-14" alt="Logo" />
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
            <Button className="w-12 h-10 hidden sm:inline" color="gray" pill>
                <FaMoon/>
            </Button>
            <Link to="/about">
                <Button className="bg-custom-orange hover:!bg-custom-dark-orange">ABOUT ME</Button>
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
    active={path === "/content"}
    className={path === "/content" ? "!text-custom-dark-orange bg-inherit" : ""}
    as={'div'} // Use 'div' instead of 'a'
  >
    <Link to="/content" className="hover:text-custom-dark-orange">
      My Content
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
</Navbar.Collapse>


      </Navbar>
      </>
    )
  }
  
  export default Header