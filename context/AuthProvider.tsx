import React, { createContext, useState } from 'react';



type TDefaultContext = {
  user: {
    address: string;
    isLogin: boolean;
  };
  onLogin: () => void;
  onLogout: () => void;
}

const appContext: TDefaultContext = {
  user: {
    address: '',
    isLogin: false,
  },
  onLogin: () => { },
  onLogout: () => { },
}


export const AuthContext = createContext<TDefaultContext>(appContext)

interface IAuthProvider {
  children: React.ReactNode
}

const AuthProvider = ({ children }: IAuthProvider) => {
  const [user, setUser] = useState({
    address: '',
    isLogin: false
  })


  const onLogin = () => {

  }

  const onLogout = () => {

  }

  return (
    <AuthContext.Provider value={{ onLogin, onLogout, user }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
