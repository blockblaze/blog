import {Link} from "react-router-dom";
import { useEffect, useState } from "react";
import {PostCard} from "../components/PostCards";
import { Carousel } from "flowbite-react";
import { MdOutlineDoubleArrow } from "react-icons/md";



function Home() {
  const [posts, setPosts] = useState([]);
  const [slides, setSliders] = useState([]);


  useEffect(()=>{
    const fetchSlides = async()=> {
      const res = await fetch('slidesConfig.json');
      const data = await res.json();
      setSliders(data);
    };
    const fetchPosts = async () => {
      const res = await fetch('/api/post/getposts?limit=9');
      const data = await res.json();
      setPosts(data);
    };
    fetchPosts();
    fetchSlides();
  },[]);
    return (
      <div className="min-h-screen">
        <div className='flex flex-col gap-4 p-16 px-10 w-full bg-gray-100 dark:bg-gray-800 mx-auto mb-5 h-72'>
        <h1 className='text-3xl font-bold lg:text-6xl dark:text-white'>Hey, I&apos;m BlockBlaze!</h1>
        <p className='dark:text-white text-sm sm:text-sm'>
        Explore the world of Minecraft Bedrock with me, a passionate maps and scripts creator.
        </p>
        <Link className="underline text-custom-orange text-sm" to="/about">
        <div className="mx-auto flex cursor-pointer">
            <p className="font-semibold text-lg text-custom-orange hover:underline">Find Out More</p>
            <MdOutlineDoubleArrow color="orange" className="text-2xl mt-[2.5px] "/>
          </div>
        </Link>

      </div>


      <div className="mb-40 relative w-[80%] m-auto text-center h-[500px] flex flex-col gap-7">
      <div className="flex flex-col gap-2">
      <h1 className='text-3xl font-bold lg:text-4xl dark:text-white'>Explore Content</h1>
      <p className='text-gray-500 text-sm sm:text-sm'>
      Discover unique maps, gameplay insights, and tips on this blog.
        </p>
        </div>

      <Carousel slideInterval={3000} className="carousel" pauseOnHover={true}>
        {slides.map((slide, index) => (
          <div key={index} className="relative h-full">
            {/* Background Image */}
            <img
              src={slide.image}
              alt={slide.alt}
              className="object-cover w-full h-full"
            />
            {/* Overlay Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 text-white p-4 text-center">
              <h2 className="text-2xl font-bold">{slide.title}</h2>
              <p className="mt-2 md:text-sm w-[80%] text-xs">{slide.description}</p>
              <a
                href={slide.buttonLink}
                className="mt-4 px-4 py-2 bg-transparent border-gray-200 border-2 text-white rounded-lg  focus:outline-none"
              >
                {slide.buttonText}
              </a>
            </div>
          </div>
        ))}
      </Carousel>
    </div>




        {posts && posts.length > 0 && (
          <div className='flex flex-col gap-2 justify-center items-center mb-5'>
            <h1 className='text-3xl font-bold lg:text-4xl dark:text-white'>Recent Posts</h1>
            <div className='flex flex-wrap gap-7 mt-5 justify-center items-stretch'>
              {posts.map((post) => (
                <PostCard key={post.postId} post={post} />
              ))}
            </div>
            <Link
              to={'/search'}
              className='text-lg text-custom-dark-orange hover:underline text-center mt-8'
            >
              View all content
            </Link>
          </div>
        )}

      </div>
    )
  }
  
  export default Home