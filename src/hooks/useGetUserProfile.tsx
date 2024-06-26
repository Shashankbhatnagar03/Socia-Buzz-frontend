import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useShowToast from "./useShowToast";
import { IUser } from "../types/types";

const useGetUserProfile = () => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { username } = useParams();
  const toast = useShowToast();

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(
          `https://sociabuzz-backend.onrender.com/api/v1/users/profile/${username}`,
          {
            credentials: "include",
          }
        );
        const data = await res.json();
        if (data.error) {
          toast("Error", data.error, "error");
          return;
        }
        if (data.isFrozen) {
          setUser(null);
          return;
        }

        setUser(data);
      } catch (error) {
        toast("Error", "User page not fetched", "error");
      } finally {
        setLoading(false);
      }
    };
    getUser();
  }, [username, toast]);

  return { loading, user };
};

export default useGetUserProfile;
