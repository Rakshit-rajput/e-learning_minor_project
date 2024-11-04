import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { server } from "../main";
import toast, { Toaster } from "react-hot-toast";

const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState([]);
  const [isAuth, setIsAuth] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  async function loginUser(email, password, navigate, fetchMyCourse) {
    setBtnLoading(true);

    // Example: If email or password matches dummy credentials, skip API call and use dummy data
    if (email === "dummy@example.com" && password === "dummyPassword") {
      const dummyUser = {
        id: "dummyUser123",
        name: "Dummy User",
        email: "dummy@example.com",
      };

      // Simulating the process for a real login
      setUser(dummyUser);
      setIsAuth(true);
      localStorage.setItem("token", "dummyToken"); // Simulate token storage

      toast.success("Login successful!");
      setBtnLoading(false);
      navigate("/"); // Navigate to homepage after login
      fetchMyCourse(); // Fetch user's courses if needed
      return;
    }

    // Existing login API call if not dummy user
    try {
      const { data } = await axios.post(`${server}/api/user/login`, {
        email,
        password,
      });

      toast.success(data.message);
      localStorage.setItem("token", data.token);
      setUser(data.user);
      setIsAuth(true);
      setBtnLoading(false);
      navigate("/");
      fetchMyCourse();
    } catch (error) {
      setBtnLoading(false);
      setIsAuth(false);
      toast.error(error.response.data.message);
    }
  }
  // async function loginUser(email, password, navigate, fetchMyCourse) {
  //   setBtnLoading(true);
  //   try {
  //     const { data } = await axios.post(`${server}/api/user/login`, {
  //       email,
  //       password,
  //     });

  //     toast.success(data.message);
  //     localStorage.setItem("token", data.token);
  //     setUser(data.user);
  //     setIsAuth(true);
  //     setBtnLoading(false);
  //     navigate("/");
  //     fetchMyCourse();
  //   } catch (error) {
  //     setBtnLoading(false);
  //     setIsAuth(false);
  //     toast.error(error.response.data.message);
  //   }
  // }

  async function registerUser(name, email, password, navigate) {
    setBtnLoading(true);
    try {
      const { data } = await axios.post(`${server}/api/user/register`, {
        name,
        email,
        password,
      });

      toast.success(data.message);
      localStorage.setItem("activationToken", data.activationToken);
      setBtnLoading(false);
      navigate("/verify");
    } catch (error) {
      setBtnLoading(false);
      toast.error(error.response.data.message);
    }
  }

  async function verifyOtp(otp, navigate) {
    setBtnLoading(true);
    const activationToken = localStorage.getItem("activationToken");
    try {
      const { data } = await axios.post(`${server}/api/user/verify`, {
        otp,
        activationToken,
      });

      toast.success(data.message);
      navigate("/login");
      localStorage.clear();
      setBtnLoading(false);
    } catch (error) {
      toast.error(error.response.data.message);
      setBtnLoading(false);
    }
  }

  async function fetchUser() {
    try {
      const { data } = await axios.get(`${server}/api/user/me`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });

      setIsAuth(true);
      setUser(data.user);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUser();
  }, []);
  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        setIsAuth,
        isAuth,
        loginUser,
        btnLoading,
        loading,
        registerUser,
        verifyOtp,
        fetchUser,
      }}
    >
      {children}
      <Toaster />
    </UserContext.Provider>
  );
};

export const UserData = () => useContext(UserContext);
