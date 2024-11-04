import { Button, Sidebar, Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

function Post() {
    const {postSlug} = useParams();
    const [loading , setLoading] = useState(true);
    const [error , setError] = useState(false);
    const [post , setPost] = useState(null);



    
    useEffect(()=>{
        const getPost = async()=>{
            setLoading(true);

            const res = await fetch(`/api/post/getposts?slug=${postSlug}`);
            const data = await res.json();
            if(!res.ok){
                setLoading(false);
                setError(true);
                return;
            }

            if(res.ok){
                setLoading(false);
                setError(false);
                setPost(data[0]);
            }
        }
        getPost();
    },[postSlug])

    if (loading)
        return (
          <div className='flex justify-center items-center min-h-screen'>
            <Spinner size='xl' />
          </div>
        );
    return (
    <div className="flex justify-between min-h-screen w-full md:w-[90%] m-auto">

 <main className='flex flex-col p-8  w-full bg-gray-100 dark:bg-gray-700'>
 <h1 className='text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl'>
        {post && post.title}
      </h1>
      <Link
        to={`/search?category=${post && post.category}`}
        className='self-center mt-5'
      >
        <Button color='gray' pill size='xs'>
          {post && post.category}
        </Button>
      </Link>
      <img
        src={post && post.thumbnailUrl}
        alt={post && post.title}
        className='mt-10 p-3 max-h-[600px] w-[700px] m-auto object-cover'
      />
      <div className='flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs md:text-base'>
        <span>Published on {post && new Date(post.createdDATE).toDateString()}{new Date(post.updatedDATE).toDateString() !== new Date(post.createdDATE).toDateString && <span className="ml-2">(Updated on {new Date(post.updatedDATE).toDateString()})</span>}</span>
        <span className='italic'>
          {post && (post.content.length / 1000).toFixed(0)} mins read
        </span>
      </div>
      <div
        className='p-3 max-w-2xl mx-auto w-full post-content !min-h-screen'
        dangerouslySetInnerHTML={{ __html: post && post.content }}
      ></div>
      </main>
      <aside className="bg-gray-200 md:w-80 dark:bg-gray-800 hidden md:block lg:w-96 ">
      </aside>
    </div>
    )
  }
  
  export default Post;
  