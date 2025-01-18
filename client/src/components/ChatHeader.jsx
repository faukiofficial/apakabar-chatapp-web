import { X } from "lucide-react";
import useAuthStore from "../store/useAuthStore";
import useChatStore from "../store/useChatStore";
import defaultImage from "/avatar.png";
import { useState } from "react";
import ImageModal from "./ImageModal";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [imageModalSrc, setImageModalSrc] = useState("");

  const openImageModal = (src) => {
    setImageModalSrc(src);
    setImageModalOpen(true);
  };

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div
              className="size-10 rounded-full relative cursor-pointer"
              onClick={() => {
                if (selectedUser.profilePic?.url) {
                  openImageModal(selectedUser.profilePic?.url);
                }
              }}
            >
              <img
                src={selectedUser.profilePic?.url || defaultImage}
                alt={selectedUser.name}
              />
            </div>
          </div>

          {/* User info */}
          <div>
            <div className="flex items-center gap-5">
              <h3 className="font-medium">{selectedUser.name}</h3>
              <p className="text-[12px] text-gray-200">
                {onlineUsers.includes(selectedUser._id) ? (
                  <span className="bg-green-500 rounded-full px-2">Online</span>
                ) : (
                  <span className="bg-red-500 rounded-full px-2">Offline</span>
                )}
              </p>
            </div>
            <p className="text-sm text-base-content/70">{selectedUser.email}</p>
          </div>
        </div>

        {/* Close button */}
        <button onClick={() => setSelectedUser(null)}>
          <X />
        </button>
      </div>

      {/* Image modal */}
      {imageModalOpen && (
        <ImageModal
          imageModalSrc={imageModalSrc}
          setImageModalSrc={setImageModalSrc}
          setImageModalOpen={setImageModalOpen}
        />
      )}
    </div>
  );
};
export default ChatHeader;
