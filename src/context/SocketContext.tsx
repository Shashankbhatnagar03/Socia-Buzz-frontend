import { createContext, useContext, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { Socket, io } from "socket.io-client";
import { SocketContextProps, SocketContextProviderProps } from "../types/types";
// import { SocketContextProps } from "../types/types";

const SocketContext = createContext<SocketContextProps>({
  socket: undefined,
  onlineUsers: [],
});

export const useSocket = () => {
  return useContext(SocketContext);
};
export const SocketContextProvider = ({
  children,
}: SocketContextProviderProps) => {
  const user = useRecoilValue(userAtom);
  const [socket, setSocket] = useState<Socket | undefined>(undefined);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  useEffect(() => {
    if (user) {
      const newSocket = io("https://sociabuzz-backend.onrender.com", {
        query: {
          userId: user._id,
        },
      });

      setSocket(newSocket);

      newSocket.on("getOnlineUsers", (data: string[]) => {
        // console.log(data);
        setOnlineUsers(data);
      });

      return () => {
        newSocket.disconnect();
      };
    }
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
