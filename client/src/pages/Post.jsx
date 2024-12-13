import { Button, Dropdown, Label, Modal, Spinner, TextInput } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import { MdOutlineDoubleArrow } from "react-icons/md";
import {PostCardSm} from "../components/PostCards";
import { useSelector  , useDispatch } from "react-redux";
import { addDownloads, addRatedPost, addVisitedPost } from "../redux/user/userActivitySlice";
import { Helmet } from 'react-helmet-async';





function Post() {
  const { postSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [post, setPost] = useState(null);
  const [defaultRating, setDefaultRating] = useState(0);
  const [submittedRating, setSubmittedRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [isRateSubmitted, setIsRateSubmitted] = useState(false);
  const [voteCount , setVoteCount] = useState(0);
  const [downloadVersion , setDownloadVersion] = useState(null);
  // const [ratedPosts,setRatedPosts] = useState([]);
  const [showModal , setShowModal] = useState(false);
  const [feedback , setFeedback] = useState("");
  const [recentPosts, setRecentPosts] = useState(null);
  const rateElementRef = useRef(null);
  const downloadElementRef = useRef(null);
  const dispatch = useDispatch();
  const {ratedPosts,downloads,visitedPosts} = useSelector((state)=>state.userActivity);

  const handleScroll = (element) => {
    switch(element){
      case 'rate':
        rateElementRef.current.scrollIntoView({ behavior: "smooth" });

      ;break;
      case 'downloads':
        downloadElementRef.current.scrollIntoView({ behavior: "instant" });
      ;break;
    }
  };

  const getPostRating = async (postId)=>{
    const res = await fetch(`/api/rate/getrating?postId=${postId}`);
    const data = await res.json();
    setDefaultRating(parseFloat(data.rating) || 0);
    setSubmittedRating(parseFloat(data.rating) || 0);
    setVoteCount(data.voteCount)
  };

  const fetchRecentPosts = async (category,postId) => {
    const res = await fetch(`/api/post/getposts?limit=3&category=${category}&excludeIds=${postId}`);
    const data = await res.json();
    if (res.ok) {
      setRecentPosts(data);
    }
  };


  const handlePostActivity = async(action,id)=>{
      switch(action){
        case 'view':{
          if(!visitedPosts.includes(id)){
            const response = await fetch("/api/post/updatepostactivity", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                id: id,
                action: 'view',
              }),
            });
            const data = await response.json();
            
            if(data.success){
              dispatch(addVisitedPost(id))
            }
          }
        };break;

        case 'download':{
          //Download the file
          const fileUrl = downloadVersion.fileUrl; // URL of the file
          const link = document.createElement('a');
          link.href = fileUrl;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link); // Cleanup

          //Add download
          if(!downloads.includes(id)){
            const response = await fetch("/api/post/updatepostactivity", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                id: id,
                action: 'download',
              }),
            });
            const data = await response.json();
            
            if(data.success){
              dispatch(addDownloads(id));
            }
          }
         
        };break;

        case 'rate':{
      // Send the rating to the backend
    const response = await fetch("/api/rate/sendrate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        postId: post.postId,
        rating: submittedRating,
      }),
    });
    const data = await response.json();

    if(data.success){
      if(submittedRating <3) setShowModal(true);
  
      // After submitting, update the UI:
      setIsRateSubmitted(true); // Mark the rating as submitted
      dispatch(addRatedPost(post.postId));
      setHover(0); // Remove hover effect
    }else{
      // After submitting, update the UI:
      setIsRateSubmitted(true); // Mark the rating as submitted
      dispatch(addRatedPost(post.postId));
      setHover(0); // Remove hover effect
    }
        }
        ;break;

        case 'feedback':{
          const response = await fetch("/api/rate/sendfeedback", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              postId: post.postId,
              feedback: feedback,
            }),
          });
          const data = await response.json();
          if(data.success) setShowModal(false);
        }
        ;break;
      }
  }

const clearHtml = (html)=>{
    const regex = /(<([^>]+)>)/gi;
const result = html.replace(regex, "");
return result;
}
  useEffect(() => {
    try{
      const getPost = async () => {
        setLoading(true);
        const res = await fetch(`/api/post/getposts?slug=${postSlug}`);
        const data = await res.json();
        if (!res.ok) {
          setLoading(false);
          setError(data.message);
          return;
        }
        if (res.ok) {
          if(data.length === 0){
            setLoading(false);
            setError("No post found");
          }else{
            setLoading(false);
            setError(false);
            setPost(data[0]);
            getPostRating(data[0].postId)
            fetchRecentPosts(data[0].category,data[0].postId);
            handlePostActivity("view",data[0].postId)
            if(data[0].category === "maps" || data[0].category === "scripts"){
              setDownloadVersion(data[0].downloadables[data[0].downloadables.length-1])
            }
  
          }
  
        }
      };
      getPost();
    // eslint-disable-next-line no-unused-vars
    }catch(err){
      setError("An error happend")
      setLoading(false);
    }
   
  }, [postSlug]);


  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl" />
      </div>
    );

    if(error) return(
      <div className="min-h-screen m-5"><p className="text-center text-2xl">{error}</p></div>
    );



  return (
    <>
      <Helmet>
        <title>{post.title}</title>
        <meta name="description" content={clearHtml(post.content)} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={clearHtml(post.content)} />
        <meta property="og:image" content={post.thumbnailUrl} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={clearHtml(post.content)} />
        <meta name="twitter:image" content={post.thumbnailUrl} />
      </Helmet>
    <div className="flex justify-between min-h-screen w-full md:w-[90%] m-auto">
      <main className="flex flex-col p-8 w-full bg-gray-100 dark:bg-gray-700">
        <h1 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">
          {post && post.title}
        </h1>
        <Link
          to={`/search?category=${post && post.category}`}
          className="self-center mt-3"
        >
          <Button color="gray" pill size="xs">
            {post && post.category}
          </Button>
        </Link>

        <div className="self-center mt-5 flex flex-row gap-2">
  {[...Array(5)].map((_, index) => {
    const starValue = index + 1;
    const isFullStar = starValue <= Math.floor(defaultRating); // Full stars
    const isHalfStar =
      starValue === Math.ceil(defaultRating) &&
      !Number.isInteger(defaultRating); // Half star condition

    return (
      <div key={starValue} className="relative text-xl">
        {/* Gray star as background */}
        <FaStar
          className="absolute text-gray-400"
          style={{ zIndex: 0 }}
        />
        {/* Orange overlay for half or full stars */}
        <FaStar
          className="relative"
          style={{
            color: isFullStar || isHalfStar ? "orange" : "gray",
            clipPath: isHalfStar ? "polygon(0 0, 50% 0, 50% 100%, 0 100%)" : "none",
            zIndex: 1,
          }}
        />
      </div>
    );
  })}
  <p
    className="font-bold cursor-pointer underline"
    onClick={() => handleScroll("rate")}
  >
    {voteCount}
  </p>
</div>

        {post.category === "maps" || post.category === "scripts"?(
          <div className="mx-auto mt-10 flex cursor-pointer" onClick={()=>handleScroll("downloads")}>
            <p className="font-semibold text-lg text-custom-orange hover:underline">Skip to Downloads</p>
            <MdOutlineDoubleArrow color="orange" className="text-2xl mt-[2.5px] "/>
          </div>
        ):null}

        <img
          src={post && post.thumbnailUrl}
          alt={post && post.title}
          className="mt-10 p-3 max-h-[600px] w-[700px] m-auto object-cover"
        />
        <div className="flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs md:text-base">
          <span>
            Published on {post && new Date(post.createdDATE).toDateString()}
            {new Date(post.updatedDATE).toDateString() !==
              new Date(post.createdDATE).toDateString && (
              <span className="ml-2">
                (Updated on {new Date(post.updatedDATE).toDateString()})
              </span>
            )}
          </span>
          <span className="italic">
            {post && (post.content.length / 1000).toFixed(0)} mins read
          </span>
        </div>
        <div
          className='p-3 max-w-2xl mx-auto w-full post-content !min-h-screen border-b border-slate-500'
          dangerouslySetInnerHTML={{ __html: post && post.content }}
        ></div>

        {post.category === "maps" || post.category === "scripts"?(
          <div className="mt-5 mb-5 flex flex-col gap-1" id="downloads" ref={downloadElementRef}>
            <p className="mb-3 font-semibold text-lg lg:text-2xl">Select version for download:</p>
        <Dropdown label={downloadVersion.version} inline className="border border-slate-800">
          {post.downloadables.map(d=>(
              // eslint-disable-next-line react/jsx-key
              <Dropdown.Item onClick={()=>{setDownloadVersion(d)}} key={d.version}>{d.version}</Dropdown.Item>
          ))}
    </Dropdown>
    {downloadVersion && downloadVersion.changelog !==''? (
          <div className="border rounded border-slate-400 mt-5">
          <div className="border-b border-slate-400 p-3"><p className="text-lg font-semibold">Changelogs</p></div>
          <div className="p-3"><p>{downloadVersion.changelog}</p></div>
        </div>
    ): null }



    <div className="mt-5 mb-5">
    <p className="mb-3 font-semibold text-lg lg:text-2xl">Supported Minecraft Versions:</p>
    <div className="flex flex-wrap gap-2">
      {downloadVersion.supportedVersions.split(",").map(v=>(
        // eslint-disable-next-line react/jsx-key
        <button className="bg-custom-orange text-white p-2 m:p-3 rounded hover:bg-custom-dark-orange font-medium self-center mt-2" key={v}>{v}</button>
      ))}
    </div>
    </div>
    <button className="download-btn w-40" onClick={()=>handlePostActivity("download",downloadVersion.downloadId)}>Download {downloadVersion.version}</button>
    <p className="self-center text-lg font-semibold">
      Downloads of this version: {downloadVersion.downloads}
    </p>
          </div>
        ):null}

<div ref={rateElementRef} className="flex justify-center flex-col gap-2 mt-3 border-b border-slate-500 pb-5" >
  <p className="self-center text-3xl font-bold">Did you like this post?</p>
  <p className="self-center text-lg">Rate it by clicking on a star!</p>
  <div className="flex flex-row gap-2 self-center">
    {[...Array(5)].map((_, index) => {
      const starValue = index + 1;
      const isFullStar = starValue <= Math.floor(hover || submittedRating); // Full stars
      const isHalfStar =
        starValue === Math.ceil(hover || submittedRating) &&
        !Number.isInteger(hover || submittedRating); // Half star condition

      return (
        <div
          key={starValue}
          className={`relative text-3xl ${ratedPosts.includes(post.postId) ? "cursor-default" : "cursor-pointer"}`}
          onClick={() => {
            if (!ratedPosts.includes(post.postId) && starValue !== submittedRating) {
              setSubmittedRating(starValue);
              setIsRateSubmitted(true);
            }
          }}
          onMouseEnter={() => {
            if (!ratedPosts.includes(post.postId)) setHover(starValue);
          }}
          onMouseLeave={() => {
            if (!ratedPosts.includes(post.postId)) setHover(0);
          }}
        >
          {/* Gray star as background */}
          <FaStar className="absolute text-gray-400" style={{ zIndex: 0 }} />
          {/* Orange overlay for half or full stars */}
          <FaStar
            className="relative"
            style={{
              color: isFullStar || isHalfStar ? "orange" : "gray",
              clipPath: isHalfStar
                ? "polygon(0 0, 50% 0, 50% 100%, 0 100%)"
                : "none",
              zIndex: 1,
            }}
          />
        </div>
      );
    })}
  </div>
  {!ratedPosts.includes(post.postId) && isRateSubmitted && (
    <button
      className="bg-custom-orange text-white p-2 m:p-3 rounded hover:bg-custom-dark-orange font-medium self-center w-32 mt-2"
      onClick={()=>handlePostActivity("rate")}
    >
      Submit
    </button>
  )}
  {ratedPosts.includes(post.postId) && (
    <p className="self-center text-lg  font-semibold mt-1">
      Thanks for rating this post.
    </p>
  )}
  <p className="self-center text-lg">
    Average rating {defaultRating} / 5. Vote count: {voteCount}
  </p>
</div>

<div className='flex flex-col justify-center items-center mb-5'>
        <h1 className='text-2xl font-semibold mt-5 mb-3'>YOU MAY ALSO LIKE...</h1>
        <div className='flex flex-wrap gap-1 mt-5 justify-center items-stretch'>
          {recentPosts &&
            recentPosts.map((post) =><PostCardSm  post={post} key={post.slug}/>)}

          
        </div>
      </div>

<Modal show={showModal} size="md" onClose={()=>setShowModal(false)} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">I&apos;m sorry you didn&apos;t like this post

</h3>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="email" value="Tell me how could I improve this post?" />
              </div>
              <TextInput
                id="feedback"
                type="text"
                placeholder="Your feedback"
                onChange={(e)=>setFeedback(e.target.value)}
                required
              />
            </div>
            

            <div className="w-full">
            <button
      className="bg-custom-orange text-white p-3 m:p-4 rounded hover:bg-custom-dark-orange font-medium self-center  mt-2"
      onClick={()=>handlePostActivity("feedback")}
    >
      Submit feedback
    </button>  </div>
            
          </div>
        </Modal.Body>
      </Modal>
      </main>
      <aside className="bg-gray-200 md:w-80 dark:bg-gray-800 hidden md:block lg:w-96 "></aside>
    </div>
    </>
  );
}

export default Post;
