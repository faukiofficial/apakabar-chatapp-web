import useChatStore from "../store/useChatStore";
import { useEffect, useRef, useState } from "react";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import useAuthStore from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";
import MessageSkeleton from "./skeletons/MessageSkeleton ";
import ImageModal from "./ImageModal";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
  } = useChatStore();
  const { user } = useAuthStore();
  const messageEndRef = useRef(null);

  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [imageModalSrc, setImageModalSrc] = useState("");

  const openImageModal = (src) => {
    setImageModalSrc(src);
    setImageModalOpen(true);
  };

  console.log(messages);
  console.log("user", user);

  console.log(selectedUser)

  useEffect(() => {
    getMessages(selectedUser._id);
  }, [selectedUser._id, getMessages]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${message.sender._id === user._id ? "chat-end" : "chat-start"}`}
            ref={messageEndRef}
          >
            <div className=" chat-image avatar">
              <div className="size-10 rounded-full border cursor-pointer">
                <img
                  src={
                    message.sender._id === user._id
                      ? user.profilePic.url || "/avatar.png"
                      : selectedUser.profilePic.url || "/avatar.png"
                  }
                  alt="profile pic"
                  onClick={() => {
                    if(message.sender._id === user._id){
                      if(message.sender.profilePic.url){
                        openImageModal(message.sender.profilePic.url)
                      }
                    } else {
                      if(message.receiver.profilePic.url){
                        openImageModal(message.receiver.profilePic.url)
                      }
                    }
                  }}
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>
            <div className="chat-bubble flex flex-col">
              {message.image?.url && (
                <img
                  src={message.image.url}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2 cursor-pointer"
                  onClick={() => openImageModal(message.image.url)}
                />
              )}
              {message.text && <p className="whitespace-pre-wrap">{message.text}</p>}
            </div>
          </div>
        ))}
      </div>

      <MessageInput />

      {imageModalOpen && (
        <ImageModal
          imageModalSrc={imageModalSrc}
          setImageModalOpen={setImageModalOpen}
        />
      )}
    </div>
  );
};
export default ChatContainer;