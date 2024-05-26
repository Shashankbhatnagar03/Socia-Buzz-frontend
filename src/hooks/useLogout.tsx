import useShowToast from "./useShowToast";
import { useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import { useNavigate } from "react-router-dom";

const useLogout = () => {
  const setUser = useSetRecoilState(userAtom);
  const toast = useShowToast();
  const navigate = useNavigate();
  const logout = async () => {
    try {
      const res = await fetch("/api/v1/users/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data.error) {
        toast("Error", data.error, "error");
        return;
      }
      localStorage.removeItem("user-info");
      setUser(null);
      navigate("/");
    } catch (error) {
      toast("Error", "Something went wrong", "error");
    }
  };

  return logout;
};

export default useLogout;
