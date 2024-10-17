import {Footer, TextInput } from 'flowbite-react';
// import { Link } from 'react-router-dom';
import { BsInstagram, BsTwitter, BsGithub, BsYoutube } from 'react-icons/bs';
export default function FooterCom() {
  return (
    <Footer container className='border border-t-4 border-custom-orange'>
      <div className='w-full max-w-7xl mx-auto'>
        <div className='grid w-full justify-between sm:flex md:grid-cols-1'>
        <div className='grid grid-cols-2 gap-8 mt-4 sm:grid-cols-3 sm:gap-6'>
            <div>
              <Footer.Title title='About' />
              <Footer.LinkGroup col>
                <Footer.Link
                  href='https://www.100jsprojects.com'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  My Portfolio
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title='Follow Me' />
              <Footer.LinkGroup col>
                <Footer.Link
                  href='https://www.github.com/sahandghavidel'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  MCPEDL
                </Footer.Link>
                <Footer.Link href='https://www.github.com/blockblaze'>Github</Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title='Legal' />
              <Footer.LinkGroup col>
                <Footer.Link href='#'>Privacy Policy</Footer.Link>
                <Footer.Link href='#'>Terms &amp; Conditions</Footer.Link>
              </Footer.LinkGroup>
            </div>
          </div>
          <div className='mt-5'>
<form className="flex">
  <TextInput
    id="footer-email"
    placeholder="Email Address"
    className="flex-1 font-normal"
    style={{borderRadius:0}}
    required
    // Removes rounded corners and makes input take the available width
  />
    <button className="bg-custom-orange text-white p-2 m:p-3 hover:bg-custom-dark-orange font-medium text-sm">Subscribe</button>

</form>
          </div>

        </div>
        <Footer.Divider />
        <div className='w-full sm:flex sm:items-center sm:justify-between'>
          <Footer.Copyright
            href='#'
            by="BlockBlaze"
            year={new Date().getFullYear()}
          />
          <div className="flex gap-6 sm:mt-0 mt-4 sm:justify-center">
          <Footer.Icon href='#' target='_blank' icon={BsInstagram}/>
            <Footer.Icon href='#' target='_blank' icon={BsYoutube}/>
            <Footer.Icon href='#' target='_blank' icon={BsTwitter}/>
            <Footer.Icon href='https://github.com/blockblaze' target='_blank' icon={BsGithub}/>
          </div>
        </div>
      </div>
    </Footer>
  );
}