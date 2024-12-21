import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import useGetUserProfile from '@/hooks/useGetUserProfile';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { AtSign, Heart, MessageCircle } from 'lucide-react';

const Profile = () => {
  const params = useParams();
  const userId = params.id;
  useGetUserProfile(userId);
  const [activeTab, setActiveTab] = useState('posts');

  const { userProfile, user } = useSelector((store) => store.auth);

  const isLoggedInUserProfile = user?._id === userProfile?._id;
  const isFollowing = false;

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const displayedPost = activeTab === 'posts' ? userProfile?.posts : userProfile?.bookmarks;

  return (
    <div className="flex flex-col max-w-5xl mx-auto p-4 sm:p-6 lg:p-10">
      {/* Profile Header */}
      <div className="flex flex-col lg:flex-row gap-10">
        <div className="flex items-center justify-center lg:w-1/3">
          <Avatar className="h-32 w-32 border-4 border-gray-300">
            <AvatarImage src={userProfile?.profilePicture} alt="profilephoto" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
        <div className="flex flex-col gap-5 lg:w-2/3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <span className="text-2xl font-semibold">{userProfile?.username}</span>
            <div className="flex flex-wrap items-center gap-2">
              {isLoggedInUserProfile ? (
                <>
                  <Link to="/account/edit">
                    <Button variant="secondary" className="hover:bg-gray-200 rounded-lg h-8">
                      Edit profile
                    </Button>
                  </Link>
                </>
              ) : isFollowing ? (
                <>
                  <Button variant="secondary" className="rounded-lg h-8">
                    Unfollow
                  </Button>
                  <Button variant="secondary" className="rounded-lg h-8">
                    Message
                  </Button>
                </>
              ) : (
                <Button className="bg-[#0095F6] hover:bg-[#3192d2] rounded-lg h-8">
                  Follow
                </Button>
              )}
            </div>
          </div>
          <div className="flex gap-4 text-lg">
            <p>
              <span className="font-semibold">{userProfile?.posts.length}</span> posts
            </p>
            <p>
              <span className="font-semibold">{userProfile?.followers.length}</span> followers
            </p>
            <p>
              <span className="font-semibold">{userProfile?.following.length}</span> following
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-semibold text-gray-700">{userProfile?.bio || 'bio here...'}</span>
            <Badge className="w-fit text-gray-500" variant="secondary">
              <AtSign /> <span className="pl-1">{userProfile?.username}</span>
            </Badge>
          </div>
        </div>
      </div>

      {/* Tabs and Posts */}
      <div className="border-t border-gray-200 mt-10">
        <div className="flex justify-center gap-6 text-sm mt-4">
          <span
            className={`py-2 cursor-pointer ${
              activeTab === 'posts' ? 'font-bold border-b-2 border-black' : ''
            }`}
            onClick={() => handleTabChange('posts')}
          >
            POSTS
          </span>
          <span
            className={`py-2 cursor-pointer ${
              activeTab === 'saved' ? 'font-bold border-b-2 border-black' : ''
            }`}
            onClick={() => handleTabChange('saved')}
          >
            SAVED
          </span>
          <span className="py-2 cursor-pointer">REELS</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6">
          {displayedPost?.map((post) => (
            <div key={post?._id} className="relative group cursor-pointer">
              <video
                src={post.media}
                alt="postimage"
                className="rounded-lg w-full aspect-square object-cover"
              />
              <image
                src={post.media}
                alt="postimage"
                className="rounded-lg w-full aspect-square object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex items-center text-white space-x-4">
                  <button className="flex items-center gap-2 hover:text-gray-300">
                    <Heart />
                    <span>{post?.likes.length}</span>
                  </button>
                  <button className="flex items-center gap-2 hover:text-gray-300">
                    <MessageCircle />
                    <span>{post?.comments.length}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
