import { useState } from "react";
import useShowToast from "./useShowToast";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { IUser } from "../types/types";

const useFollowUnfollow = (user: IUser) => {
  const currentUser = useRecoilValue(userAtom);
  const [updating, setUpdating] = useState<boolean>(false);
  const [following, setFollowing] = useState<boolean>(
    user.followers.includes(currentUser?._id)
  );
  const toast = useShowToast();

  const handleFollowUnfollow = async () => {
    if (!currentUser) {
      toast("Error", "Please login to follow", "error");
      return;
    }
    if (updating) return;
    setUpdating(true);
    try {
      const res = await fetch(`/api/v1/users/follow/${user._id}`, {
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
      if (following) {
        toast("Success", `Unfollowed ${user.name}`, "success");
        user.followers.pop();
      } else {
        toast("Success", `Followed ${user.name}`, "success");
        user.followers.push(currentUser?._id);
      }
      setFollowing(!following);
    } catch (error) {
      toast("Error", "Failed to Follow/Unfollow User", "error");
    } finally {
      setUpdating(false);
    }
  };
  return { handleFollowUnfollow, updating, following };
};

export default useFollowUnfollow;
