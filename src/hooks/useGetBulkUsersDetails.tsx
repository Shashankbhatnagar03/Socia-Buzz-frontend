import { useEffect, useState } from "react";
import useShowToast from "./useShowToast";
import { IUser } from "../types/types";

const useGetBulkUsersDetails = () => {
  const toast = useShowToast();
  const [bulkUser, setBulkUser] = useState<IUser[]>([]);
  const [bulkUsersLoading, setBulkUsersLoading] = useState<boolean>(true);
  useEffect(() => {
    const getBulkUsersDetails = async () => {
      try {
        setBulkUsersLoading(true);
        const res = await fetch(`/api/v1/users/profiles/bulk`);
        const data = await res.json();
        // console.log(data);
        if (data.error) {
          toast("Error", data.error, "error");
          return;
        }

        setBulkUser(data);
      } catch (error) {
        toast("Error", "User page not fetched", "error");
      } finally {
        setBulkUsersLoading(false);
      }
    };
    getBulkUsersDetails();
  }, [toast, setBulkUser, setBulkUsersLoading]);
  return { bulkUser, bulkUsersLoading };
};

export default useGetBulkUsersDetails;
