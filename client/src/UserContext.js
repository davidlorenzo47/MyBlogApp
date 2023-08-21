import {createContext, useState} from "react";
//user context will be used to update header
export const UserContext = createContext({});

export function UserContextProvider({children}) {
  const [userInfo,setUserInfo] = useState({});  //we have a state here 
  return (
    <UserContext.Provider value={{userInfo,setUserInfo}}>
      {children}
    </UserContext.Provider>
  );
}