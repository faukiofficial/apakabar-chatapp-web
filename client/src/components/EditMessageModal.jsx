import { useEffect, useRef, useState } from "react";
import { Image, X, Send } from "lucide-react";
import toast from "react-hot-toast";
import useChatStore from "../store/useChatStore";

const EditMessageModal = ({
  openEditModal,
  setOpenEditModal,
  message,
}) => {
  const [text, setText] = useState(message?.text || "");
  const [imagePreview, setImagePreview] = useState(message?.image?.url || null);
  const [imageToSend, setImageToSend] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setText(message?.text || "");
    setImagePreview(message?.image?.url || null);
  }, [message]);

  
  const { updateMessage } = useChatStore();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    setImageToSend(file);
    const imageUrl = URL.createObjectURL(file);
    setImagePreview(imageUrl);
  };

  const removeImage = () => {
    setImagePreview(null);
    setImageToSend(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!text.trim() && !imagePreview) {
      toast.error("Please add text or an image");
      return;
    }

    try {
      await updateMessage({
        ...message,
        text: text.trim(),
        image: imageToSend || message.image,
        messageId: message._id,
      });

      setOpenEditModal(false);
    } catch (error) {
      console.error("Failed to update message:", error);
      toast.error("Failed to update message");
    }
  };

  if (!openEditModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-base-200 p-6 rounded-lg w-full max-w-md shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Edit Message</h3>
          <button
            onClick={() => setOpenEditModal(false)}
            className="btn btn-circle btn-ghost text-zinc-400 hover:text-zinc-600"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {imagePreview && (
            <div className="relative flex justify-center">
              <img
                src={imagePreview}
                alt="Preview"
                className="max-h-[200px] object-cover rounded-lg border border-zinc-700"
              />
              <button
                onClick={removeImage}
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-base-300
                flex items-center justify-center"
                type="button"
              >
                <X className="size-4" />
              </button>
            </div>
          )}

          <textarea
            className="textarea textarea-bordered w-full h-24 resize-none"
            placeholder="Edit your message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <div className="flex items-center gap-2">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleImageChange}
            />
            <button
              type="button"
              className="btn btn-sm btn-outline"
              onClick={() => fileInputRef.current?.click()}
            >
              <Image size={16} /> Attach Image
            </button>

            <button
              type="submit"
              className="btn btn-sm btn-primary flex items-center gap-2"
            >
              <Send size={16} /> Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMessageModal;
