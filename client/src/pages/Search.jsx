import { Select, TextInput } from "flowbite-react";
import { PostCardSm } from "../components/PostCards";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Search() {
  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    order: "desc",
    category: "",
  });

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm") || "";
    const orderFromUrl = urlParams.get("order") || "desc";
    const categoryFromUrl = urlParams.get("category") || "";

    setSidebarData({
      searchTerm: searchTermFromUrl,
      order: orderFromUrl,
      category: categoryFromUrl,
    });

    const fetchPosts = async () => {
      setLoading(true);
      if (!urlParams.get("category")) urlParams.delete("category");

      urlParams.set("q", searchTermFromUrl);
      const searchQuery = urlParams.toString();
      console.log(searchQuery);

      try {
        const res = await fetch(`/api/post/getposts?${searchQuery}`);
        if (!res.ok) throw new Error("Failed to fetch posts");

        const data = await res.json();
        setPosts(data);
        setLoading(false);
        setShowMore(data.length === 9);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchPosts();
  }, [location.search]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setSidebarData((prev) => ({
      ...prev,
      [id]: id === "order" ? value || "desc" : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", sidebarData.searchTerm);
    urlParams.set("order", sidebarData.order);
    urlParams.set("category", sidebarData.category);

    navigate(`/search?${urlParams.toString()}`);
  };

  const handleShowMore = async () => {
    const startIndex = posts.length;
    const urlParams = new URLSearchParams(location.search); // Initialize urlParams first
    const searchTermFromUrl = urlParams.get("searchTerm") || ""; // Access it after initialization
    urlParams.set("offset", startIndex);
    urlParams.set("q", searchTermFromUrl);

    const searchQuery = urlParams.toString();
    console.log(searchQuery);

    try {
      const res = await fetch(`/api/post/getposts?${searchQuery}`);
      if (!res.ok) throw new Error("Failed to fetch more posts");

      const data = await res.json();
      setPosts((prev) => [...prev, ...data]);
      setShowMore(data.length === 9);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b md:border-r md:min-h-screen border-gray-500">
        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">Search Term:</label>
            <TextInput
              placeholder="Search..."
              id="searchTerm"
              type="text"
              value={sidebarData.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold">Order:</label>
            <Select
              onChange={handleChange}
              value={sidebarData.order}
              id="order"
            >
              <option value="desc">Latest</option>
              <option value="asc">Oldest</option>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold">Category:</label>
            <Select
              onChange={handleChange}
              value={sidebarData.category}
              id="category"
            >
              <option value="">No Category</option>
              <option value="maps">Maps</option>
              <option value="scripts">Scripts</option>
              <option value="articles">Articles & Tutorials</option>
            </Select>
          </div>
          <button
            type="submit"
            className="w-full bg-transparent text-black dark:text-white border-custom-dark-orange border-2 p-2 m:p-3 rounded hover:text-white hover:bg-custom-dark-orange font-medium self-center mt-2 transition-all duration-150"
          >
            Apply Filters
          </button>
        </form>
      </div>
      <div className="w-full">
        <h1 className="text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5">
          Results:
        </h1>
        <div className="p-7 flex flex-wrap gap-4">
          {!loading && posts.length === 0 && (
            <p className="text-xl text-gray-500">No posts found.</p>
          )}
          {loading && <p className="text-xl text-gray-500">Loading...</p>}
          {!loading &&
            posts.map((post) => <PostCardSm key={post.postId} post={post} />)}
          {showMore && (
            <button
              onClick={handleShowMore}
              className="text-custom-orange text-lg hover:underline p-7 w-full"
            >
              Show More
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Search;
