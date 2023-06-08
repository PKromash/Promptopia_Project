"use client";

import {useState, useEffect} from "react";

import PromptCard from "./PromptCard";

const PromptCardList = ({data, handleTagClick}) => {
  return (
    <div className="mt-16 prompt_layout">
      {data.map((post) => {
        return (
          <PromptCard
            key={post._id}
            post={post}
            handleTagClick={handleTagClick}
          />
        );
      })}
    </div>
  );
};

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [searchText, setSearchText] = useState("");

  const filterPosts = (posts, text) => {
    const filteredPosts = posts.filter((post) => {
      const postTag = post.tag.toLowerCase();
      const postCreator = post.creator.username.toLowerCase();
      return (
        postTag.includes(text.toLowerCase()) ||
        postCreator.includes(text.toLowerCase())
      );
    });
    return filteredPosts;
  };

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
    if (e.target.value.length === 0) setPosts(allPosts);
    else if (e.target.value.length < searchText.length) {
      setPosts(filterPosts(allPosts, e.target.value));
    } else {
      setPosts(filterPosts(posts, e.target.value));
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch("/api/prompt");
      const data = await response.json();
      setPosts(data);
      setAllPosts(data);
    };
    fetchPosts();
  }, []);

  return (
    <section className="feed">
      <form className="relative w-full flex-center">
        <input
          type="text"
          placeholder="Search for a tag or username"
          value={searchText}
          onChange={handleSearchChange}
          required
          className="search_input peer"
        />
      </form>

      <PromptCardList
        data={posts}
        handleTagClick={(post) => {
          setSearchText(post.tag);
          handleSearchChange({target: {value: post.tag}});
        }}
      />
    </section>
  );
};

export default Feed;
