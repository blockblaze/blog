import { Button, Dropdown, Spinner } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import { MdOutlineDoubleArrow } from "react-icons/md";


function Post() {
  const { postSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [post, setPost] = useState(null);
  const [defaultRating, setDefaultRating] = useState(0);
  const [submittedRating, setSubmittedRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [isRateSubmitted, setIsRateSubmitted] = useState(false);
  const [downloadVersion , setDownloadVersion] = useState("1.0");
  const rateElementRef = useRef(null);
  const downloadElementRef = useRef(null);
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


  useEffect(() => {
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
          setDefaultRating(data[0]?.rating || 3);
          setSubmittedRating(data[0]?.rating || 3);
          setDownloadVersion(data[0].downloadables[data[0].downloadables.length-1])
        }

      }
    };
    getPost();
  }, [postSlug]);

  const handleDownload = () => {
    const fileUrl = downloadVersion.fileUrl; // URL of the file
    const link = document.createElement('a');
    link.href = fileUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link); // Cleanup
  };

  const handleRateSubmit =()=>{

  };
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
            return (
              <FaStar
                key={starValue}
                className="text-xl"
                color={starValue <= defaultRating ? "orange" : "gray"}
              />
            );
          })}
            <p className="font-bold cursor-pointer underline" onClick={()=>handleScroll("rate")}>
            {defaultRating.toFixed(1)}
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
          <div className="mt-5 flex flex-col gap-1" ref={downloadElementRef}>
            <p className="mb-3 font-semibold text-lg lg:text-2xl">Select version for download:</p>
        <Dropdown label={downloadVersion.version} inline className="border border-slate-800">
          {post.downloadables.map(d=>(
              // eslint-disable-next-line react/jsx-key
              <Dropdown.Item onClick={()=>{setDownloadVersion(d)}}>{d.version}</Dropdown.Item>
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
        <button className="bg-custom-orange text-white p-2 m:p-3 rounded hover:bg-custom-dark-orange font-medium self-center mt-2" onClick={handleRateSubmit}>{v}</button>
      ))}
    </div>
    </div>
    <button className="download-btn w-40" onClick={handleDownload}>Download</button>
          </div>
        ):null}

        <div ref={rateElementRef} className="flex justify-center flex-col gap-2 mt-3">
          <p className="self-center text-3xl font-bold">Did you like this post?</p>
          <p className="self-center text-lg">Rate it by clicking on a star!</p>
          <div className="flex flex-row gap-2 self-center">
            {[...Array(5)].map((_, index) => {
              const starValue = index + 1;
              return (
                <FaStar
                  key={starValue}
                  className="cursor-pointer text-3xl"
                  color={starValue <= (hover || submittedRating) ? "orange" : "gray"}
                  onClick={() => {
                    // Update submitted rating on click
                    if (starValue !== submittedRating) { // Only update if different
                      setSubmittedRating(starValue);

                    }
                    setIsRateSubmitted(true)
                  }}
                  onMouseEnter={() => setHover(starValue)}
                  onMouseLeave={() => setHover(0)}
                />
              );
            })}
          </div>
{isRateSubmitted && <button className="bg-custom-orange text-white p-2 m:p-3 rounded hover:bg-custom-dark-orange font-medium self-center w-36 mt-2" onClick={handleRateSubmit}>Submit</button>}
          <p className="self-center text-lg">Average rating {defaultRating} / 5. Vote count: 555</p>
        </div>
      </main>
      <aside className="bg-gray-200 md:w-80 dark:bg-gray-800 hidden md:block lg:w-96 "></aside>
    </div>
  );
}

export default Post;
