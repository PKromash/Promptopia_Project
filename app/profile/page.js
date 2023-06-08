"use client";

import {useState, useEffect} from "react";
import {useSession} from "next-auth/react";
import {useRouter} from "next/navigation";
import {useSearchParams} from "next/navigation";

import ProfilePage from "@components/Profile";

const Profile = () => {
  const router = useRouter();
  const [posts, setPosts] = useState([]);

  const {data: session} = useSession();
  const searchParams = useSearchParams();
  const userId = searchParams.get("id");
  const name = searchParams.get("name");

  const handleEdit = (post) => {
    router.push(`/update-prompt?id=${post._id}`);
  };

  const handleDelete = async (post) => {
    const hasConfirmed = confirm("Are you sure you want to delete this post?");
    if (hasConfirmed) {
      try {
        await fetch(`/api/prompt/${post._id.toString()}`, {
          method: "DELETE",
        });

        const filteredPosts = posts.filter((p) => p._id !== post._id);
        setPosts(filteredPosts);
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch(
        `/api/users/${userId ? userId : session.user.id}/posts`
      );
      const data = await response.json();
      setPosts(data);
    };
    if (session?.user.id || userId) fetchPosts();
  }, []);

  return (
    <ProfilePage
      name={session?.user.id === userId || !userId ? "My" : `${name}'s`}
      desc={`Welcome to ${
        session?.user.id === userId || !userId ? "your" : `${name}'s`
      } profile page`}
      data={posts}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
    />
  );
};

export default Profile;
