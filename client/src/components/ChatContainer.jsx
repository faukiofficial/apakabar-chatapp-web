import useChatStore from "../store/useChatStore";
import { useEffect, useRef, useState } from "react";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import useAuthStore from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";
import MessageSkeleton from "./skeletons/MessageSkeleton ";
import ImageModal from "./ImageModal";
import EditMessageModal from "./EditMessageModal";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    subscribeToMessages,
    unsubscribeFromMessages,
    selectedUser,
    deleteMessage,
  } = useChatStore();
  const { user } = useAuthStore();
  const messageEndRef = useRef(null);

  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [imageModalSrc, setImageModalSrc] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [messageToEdit, setMessageToEdit] = useState(null);

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);

  const handleClickDelete = (message) => {
    setMessageToDelete(message);
    setOpenDeleteModal(true);
  };

  const handleDeleteMessage = async () => {
    await deleteMessage(messageToDelete._id);
    setOpenDeleteModal(false);
  }

  const openImageModal = (src) => {
    setImageModalSrc(src);
    setImageModalOpen(true);
  };

  useEffect(() => {
    getMessages(selectedUser._id);

    subscribeToMessages();

    return () => {
      unsubscribeFromMessages();
    };
  }, [
    selectedUser._id,
    getMessages,
    subscribeToMessages,
    unsubscribeFromMessages,
  ]);

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
            className={`chat ${
              message.sender._id === user._id ? "chat-end" : "chat-start"
            }`}
            ref={messageEndRef}
          >
            <div className=" chat-image avatar">
              <div className="size-8 lg:size-10 rounded-full border cursor-pointer">
                <img
                  src={
                    message.sender._id === user._id
                      ? user.profilePic.url || "/avatar.png"
                      : selectedUser.profilePic.url || "/avatar.png"
                  }
                  alt="profile pic"
                  onClick={() => {
                    if (message.sender.profilePic.url) {
                        openImageModal(message.sender.profilePic.url);
                      
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
            <div className={`chat-bubble flex flex-col ${message.sender._id === user._id ? "bg-primary/40 text-base-content" : ""}`}>
              {message.sender._id === user._id && (
                <div className="flex gap-2 items-center mb-1">
                <span className="text-xs opacity-50 cursor-pointer hover:opacity-100" onClick={() => {
                  setOpenEditModal(true);
                  setMessageToEdit(message);
                }}>edit</span>
                <span className="text-[10px] opacity-50">|</span>
                <span className="text-xs opacity-50 cursor-pointer hover:opacity-100" onClick={() => handleClickDelete(message)}>delete</span>
                </div>
              )}
              {message.image?.url && (
                <img
                  src={message.image.url}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2 cursor-pointer"
                  onClick={() => openImageModal(message.image.url)}
                />
              )}
              {message.text && (
                <p className="whitespace-pre-wrap text-sm md:text-base">{message.text}</p>
              )}

              {message.isUpdated && (
                <p className="text-[10px] opacity-20 mt-1 text-end">
                  (edited)
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <MessageInput />

      {imageModalOpen && (
        <ImageModal
          imageModalSrc={imageModalSrc}
          setImageModalSrc={setImageModalSrc}
          setImageModalOpen={setImageModalOpen}
        />
      )}

      <EditMessageModal openEditModal={openEditModal} setOpenEditModal={setOpenEditModal} message={messageToEdit} />

      {openDeleteModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Delete message</h3>
            <p className="py-4">Are you sure you want to delete this message?</p>
            <div className="modal-action">
              <button className="btn" onClick={() => setOpenDeleteModal(false)}>
                Cancel
              </button>
              <button
                className="btn btn-error"
                onClick={handleDeleteMessage}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default ChatContainer;
