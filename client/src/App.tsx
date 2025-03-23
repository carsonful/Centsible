// src/App.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { SignIn, SignUp, UserProfile, SignedIn, SignedOut } from '@clerk/clerk-react';
import WelcomePage from './pages/WelcomePage/WelcomePage';
import Dashboard from './pages/Dashboard/Dashboard';

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<WelcomePage />} />
      
      {/* Clerk authentication routes */}
      <Route path="/sign-in/*" element={
        <SignedOut>
          <SignIn routing="path" path="/sign-in" />
        </SignedOut>
      } />
      
      <Route path="/sign-up/*" element={
        <SignedOut>
          <SignUp routing="path" path="/sign-up" />
        </SignedOut>
      } />
      
      {/* Protected routes */}
      <Route path="/dashboard" element={
        <>
          <SignedIn>
            <AuthLayout>
              <Dashboard />
            </AuthLayout>
          </SignedIn>
          <SignedOut>
            <Navigate to="/sign-in" replace />
          </SignedOut>
        </>
      } />
      
      <Route path="/profile" element={
        <>
          <SignedIn>
            <AuthLayout>
              <UserProfile />
            </AuthLayout>
          </SignedIn>
          <SignedOut>
            <Navigate to="/sign-in" replace />
          </SignedOut>
        </>
      } />
    </Routes>
  );
}

export default App;