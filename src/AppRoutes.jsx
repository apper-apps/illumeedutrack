import { Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import { routeArray } from './config/routes';
import NotFound from '@/components/pages/NotFound';
import Login from '@/components/pages/Login';
import Signup from '@/components/pages/Signup';
import Callback from '@/components/pages/Callback';
import ErrorPage from '@/components/pages/ErrorPage';
import ResetPassword from '@/components/pages/ResetPassword';
import PromptPassword from '@/components/pages/PromptPassword';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/callback" element={<Callback />} />
      <Route path="/error" element={<ErrorPage />} />
      <Route path="/prompt-password/:appId/:emailAddress/:provider" element={<PromptPassword />} />
      <Route path="/reset-password/:appId/:fields" element={<ResetPassword />} />
      <Route path="/" element={<Layout />}>
        {routeArray.map((route) => (
          <Route
            key={route.id}
            path={route.path}
            element={<route.component />}
            index={route.path === '/'}
          />
        ))}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;