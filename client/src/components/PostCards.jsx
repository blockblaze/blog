/* eslint-disable react/prop-types */

import { Card } from "flowbite-react";
import { Link } from "react-router-dom";


export function PostCardSm({post}) {

const clearHtml = (html)=>{
    const regex = /(<([^>]+)>)/gi;
const result = html.replace(regex, "");
return result;
}

  return (
    <Link to={`/post/${post.slug}`} className="md:max-w-56 max-w-72 flex items-stretch">
    <Card
    className="hover:bg-[#f1c130] transition-all duration-150 hover:translate-y-[-1%]"
    renderImage={() => <img className="h-[100px] object-cover w-full rounded-t-md" src={post.thumbnailUrl} alt="image 1" />}
    >
      <h5 className="text-sm font-semibold tracking-tight text-gray-900 dark:text-white line-clamp-2 ">
        {post.title}
      </h5>
      <p className="font-normal text-xs text-gray-700 dark:text-gray-400 line-clamp-3 ">
      {new Date(post.updatedDATE).toDateString()}
      </p>
    </Card>
    </Link>
  );
}
