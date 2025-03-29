import React, { useState } from 'react';
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
  
  const currUser: usertype = {
    id: user?.id,
    firstName: user?.firstName,
    lastName: user?.lastName,
    emailAddress: user?.emailAddresses[0].emailAddress,
    imageUrl: user?.imageUrl,
    createdAt: user?.createdAt
  }

  if(!isLoaded) {
    return <div>Loading...</div>;
  } else { 
    syncUserToFirestore(currUser);
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="dashboard-logo">
          FairShare
        </div>
        <div className="dashboard-tabs">
          <button 
            className={`tab-button ${activeTab === 'personal' ? 'active' : ''}`}
            onClick={() => setActiveTab('personal')}
          >
            Personal
          </button>
          <button 
            className={`tab-button ${activeTab === 'household' ? 'active' : ''}`}
            onClick={() => setActiveTab('household')}
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
        {activeTab === 'personal' ? (
          <Personal userId={currUser.id} />
        ) : (
          <Household />
        )}
      </div>
    </div>
  );
};

export default Dashboard;