import { useGoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";
import useAuthStore from "../store/useAuthStore";
import { FcGoogle } from "react-icons/fc";

const fetchGoogleUserInfo = async (accessToken) => {
  try {
    const response = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch user info");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    toast.error(error);
    throw error;
  }
};

export const CustomGoogleLoginButton = () => {
  const { socialLogin } = useAuthStore();

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (response) => {
      const accessToken = response.access_token;

      try {
        const userInfo = await fetchGoogleUserInfo(accessToken);

        const data = {
          name: userInfo.name,
          email: userInfo.email,
          picture: userInfo.picture,
        };

        socialLogin(data);
      } catch (error) {
        console.error(error);
        toast.error(error);
      }
    },
    onError: (error) => {
        toast.error(error);
    },
  });

  return (
    <button
      onClick={handleGoogleLogin}
      className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium bg-base-100 hover:bg-base-300 border border-base-300 rounded-lg shadow-sm hover:shadow-md"
    >
      <FcGoogle className="w-5 h-5 mr-2" />
      Join with Google
    </button>
  );
};
