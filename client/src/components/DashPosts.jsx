import { Link } from "react-router-dom";
import { Table, TextInput , Button , Modal } from "flowbite-react";
import { useEffect, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { HiOutlineExclamationCircle } from "react-icons/hi";

export function DashPosts(){

    const [posts , setPosts] = useState([]);
    const [showMore , setShowMore] = useState(true);
    const [searchQuery , setSearchQuery] = useState(null);
    const [showModal , setShowModal] = useState(false);
    const [postIdToDelete , setPostIdToDelete] = useState(null);

    useEffect(()=>{
        const fetchPosts = async ()=>{
            const res = await fetch("/api/post/getposts");
            const data = await res.json();

            if(res.ok){
                setPosts(data)
                if(data.length <9) setShowMore(false)
            }
        }
        fetchPosts();
    },[])

    const handleShowMore = async ()=>{
      try{
        if(!searchQuery || searchQuery == ''){
          const startIndex = posts.length;
          const res = await fetch(`/api/post/getposts?offset=${startIndex}`);
          const data = await res.json();
          
          if(res.ok){
            setPosts((prev)=>[...prev , ...data]);
            if (data.length < 9) {
              setShowMore(false);
            }
          }
        }else{
          const startIndex = posts.length;
          const res = await fetch(`/api/post/searchposts?q=${searchQuery}&offset=${startIndex}`);
          const data = await res.json();
          
          if(res.ok){
            console.log(data)
            setPosts((prev)=>[...prev , ...data]);
            if (data.length < 9) {
              setShowMore(false);
            }
          }
        }
       
      }catch(err){
        console.log(err)
      }

      
    };

    const handleSearch = async (e)=>{
      try{
        e.preventDefault();

        if(searchQuery === '') return;

        const res = await fetch(`/api/post/searchposts?q=${searchQuery}`);
        const data = await res.json();

        if(res.ok){
          setPosts(data);
        }

      }catch(err){
        console.log(err)
      }
    };

    const handleDeletePost = async ()=>{
      setShowModal(false);

      try{
        const res = await fetch(
          `/api/post/deletepost/${postIdToDelete}`,
          {
            method: 'DELETE',
          }
        );
        const data = await res.json();

        if(!res.ok){
          console.log(data.message);
        }else{
          setPosts((prev) =>
            prev.filter((post) => post.postId !== postIdToDelete)
          );
        }
      }catch(err){
        console.log(err)
      }
    };

    return(

        <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'">
            <div className="mb-3">
                <form onSubmit={handleSearch}>
                <TextInput
                placeholder="Search a post..."
                icon={AiOutlineSearch}
                onChange={(e)=>setSearchQuery(e.target.value)}
                minLength={3}
                required
                />
                </form>
            </div>
            {posts.length  >0? (
                <div>
                <Table hoverable className="shadow-md">
                    <Table.Head>
                <Table.HeadCell>Updated at</Table.HeadCell>
                <Table.HeadCell>Post thumbnail</Table.HeadCell>
                <Table.HeadCell>Post title</Table.HeadCell>
                <Table.HeadCell>Category</Table.HeadCell>
                <Table.HeadCell>
                    <span>Delete</span>
                </Table.HeadCell>
                <Table.HeadCell>
                    <span>Edit</span>
                </Table.HeadCell>
                </Table.Head>
                {posts.map((post)=>(
                // eslint-disable-next-line react/jsx-key
                <Table.Body className='divide-y'>
                    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell>{new Date(post.updatedDATE).toDateString()}</Table.Cell>
                    <Table.Cell>
                    <Link to={`/post/${post.slug}`}>
                      <img
                        src={post.thumbnailUrl}
                        alt={post.title}
                        className='w-20 h-10 object-cover bg-gray-500'
                      />
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      className='font-medium text-gray-900 dark:text-white'
                      to={`/post/${post.slug}`}
                    >
                      {post.title}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>{post.category}</Table.Cell>
                  <Table.Cell>
                    <span className="font-medium text-red-500 hover:underline cursor-pointer"
                    onClick={()=>{setPostIdToDelete(post.postId);setShowModal(true)}}
                    >
                        Delete
                    </span>
                    </Table.Cell>
                  <Table.Cell>
                  <Link to={`/dashboard?tab=update&postId=${post.postId}`} className="text-teal-500 hover:underline">
                  <span>
                    Edit
                    </span>
                  </Link>
                    </Table.Cell>
                    </Table.Row>

            </Table.Body>
                ))}
                </Table>
                {showMore && (
            <button
              // onClick={handleShowMore}
              onClick={handleShowMore}
              className='w-full text-teal-500 self-center text-sm py-7'
            >
              Show more
            </button>
          )}
                </div>
            ): <p className="p-3">No posts to preview.</p>}
              <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size='md'
      >
        <Modal.Header />
        <Modal.Body>
          <div className='text-center'>
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
              Are you sure you want to delete this post?
            </h3>
            <div className='flex justify-center gap-4'>
              <Button color='failure' onClick={handleDeletePost}>
                Yes, I&apos;m sure
              </Button>
              <Button color='gray' onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
        </div>
    );
}