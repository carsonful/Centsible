// src/pages/Dashboard/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import { UserButton, useUser } from '@clerk/clerk-react';
import { syncUserToFirestore } from '../../firebase/firebase';
import { usertype } from '../../types/types';
import Personal from './Personal/Personal';
import Household from './Household/HouseHold';
import PendingInvitations from '../../components/PendingInvitations';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const { user, isLoaded } = useUser();
  
  // Keep track of whether each tab has been loaded at least once
  const [tabsLoaded, setTabsLoaded] = useState({
    personal: false,
    household: false
  });
  
  const currUser: usertype = {
    id: user?.id,
    firstName: user?.firstName,
    lastName: user?.lastName,
    emailAddress: user?.emailAddresses[0].emailAddress,
    imageUrl: user?.imageUrl,
    createdAt: user?.createdAt
  }

  // When a tab becomes active, mark it as loaded
  useEffect(() => {
    if (activeTab === 'personal' && !tabsLoaded.personal) {
      setTabsLoaded(prev => ({ ...prev, personal: true }));
    } else if (activeTab === 'household' && !tabsLoaded.household) {
      setTabsLoaded(prev => ({ ...prev, household: true }));
    }
  }, [activeTab, tabsLoaded]);

  if(!isLoaded) {
    return <div>Loading...</div>;
  } else { 
    syncUserToFirestore(currUser);
  }

  // Handle tab change
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="dashboard-logo">
          FairShare
        </div>
        <div className="dashboard-tabs">
          <button 
            className={`tab-button ${activeTab === 'personal' ? 'active' : ''}`}
            onClick={() => handleTabChange('personal')}
          >
            Personal
          </button>
          <button 
            className={`tab-button ${activeTab === 'household' ? 'active' : ''}`}
            onClick={() => handleTabChange('household')}
          >
            Household
          </button>
        </div>
        <div className="user-section">
          <button className="button button-secondary">Help</button>
          <UserButton />
        </div>
      </header>
      <PendingInvitations />

      <div className="dashboard-content">
        {/* Always render both components but hide the inactive one with CSS */}
        <div style={{ display: activeTab === 'personal' ? 'block' : 'none' }}>
          {/* Only render Personal component if it has been loaded at least once */}
          {(activeTab === 'personal' || tabsLoaded.personal) && 
            <Personal userId={currUser.id} />
          }
        </div>
        
        <div style={{ display: activeTab === 'household' ? 'block' : 'none' }}>
          {/* Only render Household component if it has been loaded at least once */}
          {(activeTab === 'household' || tabsLoaded.household) && 
            <Household />
          }
        </div>
      </div>
    </div>
  );
};

export default Dashboard;