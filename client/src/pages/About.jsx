import { BsInstagram, BsTwitter, BsYoutube } from 'react-icons/bs';
import { MdOutlineDoubleArrow } from 'react-icons/md';
import { Link } from 'react-router-dom';


function About() {
    return (
  <div className="min-h-screen">
    <div className="flex flex-col lg:flex-row-reverse w-full">
    <aside className="w-full lg:w-[70%] p-10">
          <img src="https://firebasestorage.googleapis.com/v0/b/personal-blog-8ea87.appspot.com/o/assets%2Fskin.jpg?alt=media&token=d413126a-3c6b-4a9f-ba0c-4bd3c1129ef1" alt="blockblaze" className='h-full m-auto'/>
        </aside>
      <div className="flex flex-col gap-2 p-10 w-full">
      <h1 className='text-3xl font-bold lg:text-4xl dark:text-white '>ABOUT BLOCKBLAZE</h1>
      <span className=' md:text-lg text-justify'>
      Hi! I&apos;m Karim, better known online as BlockBlaze, and I’m a passionate Minecraft content creator.

This blog is my creative space where I share my creations, tutorials, and all things Minecraft. Whether you&apos;re a seasoned player or just embarking on your Minecraft journey, you’ll find something exciting and inspiring here!

My journey began in 2019 when I discovered the command block. Fascinated by its potential, I started experimenting and created my first PvP map. Though I didn’t publish it, it sparked my passion for map-making.

In 2021, I took a leap and released my first map, Mob Arena, marking the start of my adventure as a Minecraft creator. Sharing my creations with the community has been an incredible experience, and I can’t wait to keep building and exploring with you all!
        </span>
        <Link className="underline text-custom-orange text-sm mb-4" to="/contact">
        <div className="mx-auto flex cursor-pointer">
            <p className="font-semibold text-lg text-custom-orange hover:underline">Drop me a message</p>
            <MdOutlineDoubleArrow color="orange" className="text-2xl mt-[2.5px] "/>
          </div>
        </Link>


      <div className="flex flew-row gap-3">
      <a href="" className='text-lg bg-gray-800 text-white p-2 rounded-lg'>
        <BsInstagram/>
      </a>
      <a href="" className='text-lg bg-gray-800 text-white p-2 rounded-lg'>
      <BsTwitter/>
      </a>
      <a href="" className='text-lg bg-gray-800 text-white p-2 rounded-lg'>
      <BsYoutube/>
      </a>
        </div>
        </div>


        </div>
  </div>
    )
  }
  
  export default About;
  