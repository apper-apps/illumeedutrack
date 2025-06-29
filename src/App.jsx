import React, { createContext, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import { Provider, useDispatch } from "react-redux";
import { ToastContainer } from "react-toastify";
import AppRoutes from "@/AppRoutes";
import { clearUser, setUser } from "@/store/userSlice";
import { store } from "@/store/store";

export const AuthContext = createContext(null);

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </Provider>
  );
}

function AppContent() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isInitialized, setIsInitialized] = useState(false);

useEffect(() => {
    // Check if ApperSDK is available and properly loaded
    if (!window.ApperSDK || !window.ApperSDK.ApperClient || !window.ApperSDK.ApperUI) {
      console.error("ApperSDK not fully loaded or missing required components");
      return;
    }

    try {
      const { ApperClient, ApperUI } = window.ApperSDK;
      
      const client = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
    
      ApperUI.setup(client, {
        target: '#authentication',
        clientId: import.meta.env.VITE_APPER_PROJECT_ID,
        view: 'both',
        onSuccess: function (user) {
          setIsInitialized(true);
          let currentPath = window.location.pathname + window.location.search;
          let redirectPath = new URLSearchParams(window.location.search).get('redirect');
          const isAuthPage = currentPath.includes('/login') || currentPath.includes('/signup') || 
                             currentPath.includes('/callback') || currentPath.includes('/error') || 
                             currentPath.includes('/prompt-password') || currentPath.includes('/reset-password');
          
          if (user) {
            if (redirectPath) {
              navigate(redirectPath);
            } else if (!isAuthPage) {
              if (!currentPath.includes('/login') && !currentPath.includes('/signup')) {
                navigate(currentPath);
              } else {
                navigate('/');
              }
            } else {
              navigate('/');
            }
            dispatch(setUser(JSON.parse(JSON.stringify(user))));
          } else {
            if (!isAuthPage) {
              navigate(
                currentPath.includes('/signup')
                  ? `/signup?redirect=${currentPath}`
                  : currentPath.includes('/login')
                  ? `/login?redirect=${currentPath}`
                  : '/login'
              );
            } else if (redirectPath) {
              if (
                !['error', 'signup', 'login', 'callback', 'prompt-password', 'reset-password'].some((path) => currentPath.includes(path))
              ) {
                navigate(`/login?redirect=${redirectPath}`);
              } else {
                navigate(currentPath);
              }
            } else if (isAuthPage) {
              navigate(currentPath);
            } else {
              navigate('/login');
            }
            dispatch(clearUser());
          }
        },
        onError: function(error) {
          console.error("Authentication failed:", error);
        }
      });
    } catch (error) {
      console.error("Failed to initialize ApperSDK:", error);
      setIsInitialized(true); // Still set to true to prevent infinite loading
    }
  }, [navigate, dispatch]);

  const authMethods = {
    isInitialized,
    logout: async () => {
      try {
        const { ApperUI } = window.ApperSDK;
        await ApperUI.logout();
        store.dispatch({ type: 'user/clearUser' });
        navigate('/login');
      } catch (error) {
        console.error("Logout failed:", error);
      }
    }
  };

  if (!isInitialized) {
    return (
      <div className="loading flex items-center justify-center p-6 h-screen w-full">
        <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v4"></path>
          <path d="m16.2 7.8 2.9-2.9"></path>
          <path d="M18 12h4"></path>
          <path d="m16.2 16.2 2.9 2.9"></path>
          <path d="M12 18v4"></path>
          <path d="m4.9 19.1 2.9-2.9"></path>
          <path d="M2 12h4"></path>
          <path d="m4.9 4.9 2.9 2.9"></path>
        </svg>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={authMethods}>
      <div className="App">
        <AppRoutes />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          className="z-[9999]"
        />
      </div>
    </AuthContext.Provider>
  );
}

export default App;