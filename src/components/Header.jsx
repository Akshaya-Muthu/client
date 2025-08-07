import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { useContext } from "react";
import { AppContext } from "../store/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const Header = () => {
  const navigate = useNavigate();
  const { userData, backendURL, setUserData, setIsLoggedIn } = useContext(AppContext);

  const logout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendURL + "/api/auth/logout");

      if (data.success) {
        setIsLoggedIn(false);
        setUserData(null);
        toast.success("You have successfully logged out.");
        setTimeout(() => navigate("/"), 100); // Delay for logout
      } else {
        toast.error(data.message || "Logout failed. Please try again.");
      }
    } catch (error) {
      console.error(error.message);
      toast.error(
        error.response?.data?.message || "Something went wrong during logout."
      );
    }
  };

  const sendVerificationOtp = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendURL + "/api/auth/send-verify-otp");

      if (data?.success) {
        toast.success(data.message || "OTP sent successfully!");
        navigate("/email-verify");
      } else {
        toast.error(data.message || "Failed to send OTP.");
      }
    } catch (error) {
      console.error("Error sending OTP:", error.message);
      toast.error(
        error.response?.data?.message || "Something went wrong."
      );
    }
  };

  return (
    <div className="w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0">
      <img src={assets.logo} alt="Logo" className="w-28 sm:w-32" />
      {userData ? (
        <div className="w-8 h-8 flex justify-center items-center rounded-full bg-black text-white relative group">
          {userData.name[0].toUpperCase()}
          <div className="absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-10">
            <ul className="list-none m-0 p-2 bg-gray-100 text-sm">
              {!userData.isVerified && (
                <li
                  onClick={sendVerificationOtp}
                  className="py-1 px-2 hover:bg-gray-200 cursor-pointer"
                >
                  Verify Email
                </li>
              )}
              <li
                onClick={logout}
                className="py-1 px-2 hover:bg-gray-200 cursor-pointer pr-10"
              >
                Logout
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <button
          onClick={() => navigate("/login")}
          className="flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 transition-all"
        >
          Login <img src={assets.arrow_icon} alt="" />
        </button>
      )}
    </div>
  );
};

export default Header;
