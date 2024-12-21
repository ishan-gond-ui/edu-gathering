import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { setSelectedUser } from '@/redux/authSlice';
import useGetAllMessage from '@/hooks/useGetAllMessage';
import useGetRTM from '@/hooks/useGetRTM';

const ChatPage = () => {
  const [textMessage, setTextMessage] = useState('');
  const { user, suggestedUsers, selectedUser } = useSelector((store) => store.auth);
  const { onlineUsers, messages } = useSelector((store) => store.chat);
  const dispatch = useDispatch();

  useGetRTM();
  useGetAllMessage();

  const handleBack = () => {
    dispatch(setSelectedUser(null));
  };

  return (
    <div className="flex flex-col md:flex-row h-screen md:ml-[16%] sm:ml-0">
      {/* User Selection Screen */}
      {!selectedUser && (
        <section className="w-full md:w-1/4 border-r border-gray-300 bg-white">
          <header className="p-4 font-bold text-xl border-b border-gray-300">{user?.username}</header>
          <div className="overflow-y-auto h-full">
            {suggestedUsers?.map((suggestedUser) => {
              const isOnline = onlineUsers.includes(suggestedUser?._id);
              return (
                <div
                  onClick={() => dispatch(setSelectedUser(suggestedUser))}
                  className="flex items-center gap-3 p-4 hover:bg-gray-100 cursor-pointer"
                  key={suggestedUser._id}
                >
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={suggestedUser?.profilePicture} alt={suggestedUser?.username} />
                    <AvatarFallback>{suggestedUser?.username?.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{suggestedUser?.username}</p>
                    <p className={`text-sm ${isOnline ? 'text-green-600' : 'text-red-600'}`}>
                      {isOnline ? 'Online' : 'Offline'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Chat Screen */}
      {selectedUser && (
        <section className="flex-1 flex flex-col bg-white "> 
          {/* Chat Header */}
          <header className="flex items-center gap-3 px-4 py-3 border-b border-gray-300">
            {/* Back Icon (Visible only on mobile) */}
            <button
              onClick={handleBack}
              className="md:hidden text-gray-700 hover:text-black focus:outline-none"
            >
              <ChevronLeft size={24} />
            </button>
            <Avatar className="w-10 h-10">
              <AvatarImage src={selectedUser?.profilePicture} alt={selectedUser?.username} />
              <AvatarFallback>{selectedUser?.username?.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{selectedUser?.username}</p>
            </div>
          </header>

          {/* Messages Section */}
          <div className="overflow-y-auto flex-1 p-4">
            <div className="flex justify-center">
              <div className="flex flex-col items-center justify-center">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={selectedUser?.profilePicture} alt="profile" />
                  <AvatarFallback>{selectedUser?.username?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <span>{selectedUser?.username}</span>
                <Link to={`/profile/${selectedUser?._id}`}>
                  <Button className="h-8 my-2" variant="secondary">
                    View Profile
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              {messages?.map((msg) => (
                <div
                  key={msg._id}
                  className={`flex ${msg.senderId === user?._id ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`p-2 rounded-lg max-w-xs break-words ${
                      msg.senderId === user?._id
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-black'
                    }`}
                  >
                    {msg.message}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Input Section */}
          <footer className="flex items-center gap-2 p-4 border-t border-gray-300 mb-10 lg:mb-0">
          <Input
              value={textMessage}
              onChange={(e) => setTextMessage(e.target.value)}
              type="text"
              className="flex-1"
              placeholder="Type a message..."
            />
            <Button>Send</Button>
          </footer>
        </section>
      )}
    </div>
  );
};

export default ChatPage;
