import { useState } from "react";
import useAuthStore from "../store/useAuthStore";
import { EyeIcon, EyeOffIcon, Loader } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";

const Login = () => {
  const { login, loginLoading, socialLogin } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const validateForm = () => {
    return formData.email.length > 0 && formData.password.length > 0;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      login(formData);
    } else {
      toast.error("Please fill out all fields");
    }
  };

  const handleGoogleSuccess = (credentialResponse) => {
    const { credential } = credentialResponse;

    const user = jwtDecode(credential);

    const data = {
      name: user.name,
      email: user.email,
      picture: user.picture,
    };

    socialLogin(data);
  };

  const handleGoogleError = () => {
    toast.error("Google Login failed. Please try again.");
  };

  return (
    <div className="flex justify-center items-center min-h-screen ">
      <div className="card w-[400px] m-3 shadow-xl ">
        <div className="card-body">
          <h2 className="text-2xl font-bold text-center mb-4">
            Login
          </h2>
          <form onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your Email"
                className="input input-bordered w-full"
              />
            </div>
            {/* Password Field */}
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Your Password"
                  className="input input-bordered w-full pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-4 transform -translate-y-1/2"
                >
                  {showPassword ? (
                    <EyeOffIcon className="w-6 h-6" />
                  ) : (
                    <EyeIcon className="w-6 h-6" />
                  )}
                </button>
              </div>
            </div>
            {/* Submit Button */}
            <div className="form-control mt-6">
              <button
                type="submit"
                className={`btn btn-primary w-full`}
              >
                {loginLoading && <Loader className="mr-2 animate-spin" />} Login
              </button>
            </div>
          </form>

          <div className="divider">OR</div>

          {/* Google Login */}
          <div className="form-control mt-4">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              useOneTap
            />
          </div>

          {/* Additional Links */}
          <p className="text-sm text-center mt-4">
            Don{"'"}t have an account?{" "}
            <Link
              to="/auth/register"
              className="text-primary font-semibold hover:underline"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
