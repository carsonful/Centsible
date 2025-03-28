// src/App.tsx
import { ClerkProvider, SignedIn, SignedOut } from '@clerk/clerk-react';
import WelcomePage from './pages/WelcomePage/WelcomePage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard/Dashboard';
import './pages/WelcomePage/WelcomePage.css';

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

function App() {
  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <BrowserRouter>
        <Routes>
          {/* Unprotected Routes */}
          <Route path="/" element={<WelcomePage />} />
          
          {/* For Future */}
          {/* <Route path="/aboutUs" element={<AboutUs />} /> */}
          
          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <>
                <SignedIn>
                  <Dashboard />
                </SignedIn>
                <SignedOut>
                  <WelcomePage />
                </SignedOut>
              </>
            }
          />
        </Routes>
      </BrowserRouter>
    </ClerkProvider>
  );
}

export default App;