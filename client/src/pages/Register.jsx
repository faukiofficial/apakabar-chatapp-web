import { useState } from "react";
import useAuthStore from "../store/useAuthStore";
import { EyeIcon, EyeOffIcon, Loader } from "lucide-react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { CustomGoogleLoginButton } from "../components/googleLogin";

const Register = () => {
  const { register, registerLoading, loginLoading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const validateForm = () => {
    return (
      formData.name.length > 0 &&
      formData.email.length > 0 &&
      formData.password.length > 0
    );
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
      register(formData);
    } else {
      toast.error("Please fill out all fields");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="card w-[500px] m-3 shadow-xl bg-base-200">
        <div className="card-body">
          <h2 className="text-2xl font-bold text-center mb-4">Register</h2>
          <form onSubmit={handleSubmit}>
            {/* Name Field */}
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name"
                className="input input-bordered w-full"
              />
            </div>
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
              <button type="submit" className={`btn btn-primary w-full`}>
                {registerLoading ||
                  (loginLoading && (
                    <Loader className="animate-spin mr-2" />
                  ))}{" "}
                Register
              </button>
            </div>
          </form>

          <div className="divider">OR</div>

          {/* Google Login */}
          <div className="form-control">
            <CustomGoogleLoginButton />
          </div>

          {/* Additional Links */}
          <p className="text-sm text-center mt-4">
            Already have an account?{" "}
            <Link
              to="/auth/login"
              className="text-primary font-semibold hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
