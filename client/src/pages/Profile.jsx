import { useState } from "react";
import useAuthStore from "../store/useAuthStore";
import defaultProfilePic from "/avatar.png";
import toast from "react-hot-toast";
import { CameraIcon, Loader } from "lucide-react";

const Profile = () => {
  const { user, updateProfile, isUpdateProfileLoading } = useAuthStore();

  console.log(user);

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [profilePic, setProfilePic] = useState(null);
  const [previewPic, setPreviewPic] = useState(
    user?.profilePic?.url || defaultProfilePic
  );

  console.log(user?.profilePic?.url)
  console.log(previewPic)

  const handleProfilePicChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePic(file);
      const imageUrl = URL.createObjectURL(file);
      setPreviewPic(imageUrl);
    }
  };

  const isFormChanged =
    name !== user?.name || email !== user?.email || profilePic !== null;

  const handleUpdate = async () => {
    if (!name || !email) {
      toast.error("Name and Email are required!");
      return;
    }

    const updatedData = {
      name,
      email,
      profilePic,
    };

    const isSuccess = await updateProfile(updatedData);

    if (isSuccess) {
      setProfilePic(null);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-8 px-6 py-10 shadow-md rounded-lg bg-base-200">
      <div className="flex flex-col items-center mb-6">
        <div className="relative w-32 h-32">
          <img
            src={previewPic}
            alt="Profile"
            className="rounded-full w-full h-full object-cover border-2 border-gray-300"
          />
          <label
            htmlFor="profilePicUpload"
            className="absolute bottom-0 right-0 bg-primary text-white p-1 rounded-full cursor-pointer shadow-md hover:bg-primary-focus"
          >
            <CameraIcon className="w-5 h-5" />
          </label>
          <input
            id="profilePicUpload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleProfilePicChange}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input input-bordered w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={email}
            readOnly
            onChange={(e) => setEmail(e.target.value)}
            className="input input-bordered w-full cursor-not-allowed"
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          className="btn btn-primary"
          disabled={isUpdateProfileLoading || !isFormChanged}
          onClick={handleUpdate}
        >
          {isUpdateProfileLoading && <Loader className="mr-2 animate-spin" />}{" "}
          Update
        </button>
      </div>

      <div className="mt-6 text-sm text-gray-500">
        <p>
          <strong>Member Since:</strong>{" "}
          {new Date(user?.createdAt).toLocaleDateString()}
        </p>
        <p>
          <strong>Last Updated:</strong>{" "}
          {new Date(user?.updatedAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default Profile;
