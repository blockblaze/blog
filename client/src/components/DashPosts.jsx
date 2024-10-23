import { Link } from "react-router-dom";
import { Table } from "flowbite-react";
import { useEffect, useState } from "react";

export function DashPosts(){

    const [posts , setPosts] = useState([]);
    console.log(posts)
    useEffect(()=>{
        const fetchPosts = async ()=>{
            const res = await fetch("/api/post/getposts");
            const data = await res.json();

            if(res.ok){
                setPosts(data)
            }
        }
        fetchPosts();
    },[])
    return(
        <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'">
            {posts.length  >0? (
                <>
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
                        src={post.thumbnailURL}
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
                    <span className="font-medium text-red-500 hover:underline cursor-pointer">
                        Delete
                    </span>
                    </Table.Cell>
                  <Table.Cell>
                  <Link to={`/dashboard?tab=edit&postId=${post.postId}`} className="text-teal-500 hover:underline">
                  <span>
                    Edit
                    </span>
                  </Link>
                    </Table.Cell>
                    </Table.Row>

            </Table.Body>
                ))}
                </Table>
                </>
            ): <p className="p-3">You don&apos;t have any posts yet.</p>}
        </div>
    );
}