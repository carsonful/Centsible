// src/components/PendingInvitations.tsx

import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { getPendingInvitationsByEmail, acceptHouseholdInvitation } from '../firebase/firebase';
import './PendingInvitations.css';

const PendingInvitations: React.FC = () => {
  const { user, isLoaded } = useUser();
  const [invitations, setInvitations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false); // Start with false
  const [hasChecked, setHasChecked] = useState(false); // Add this flag
  
  useEffect(() => {
    const fetchInvitations = async () => {
      if (!isLoaded || !user?.emailAddresses[0]?.emailAddress) return;
      
      setIsLoading(true); // Set loading to true when fetching starts
      
      try {
        const email = user.emailAddresses[0].emailAddress;
        const pendingInvitations = await getPendingInvitationsByEmail(email);
        setInvitations(pendingInvitations);
        setHasChecked(true); // Mark that we've checked for invitations
      } catch (error) {
        console.error("Error fetching invitations:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (isLoaded && user) {
      fetchInvitations();
    } else if (isLoaded && !user) {
      // If user is loaded but doesn't exist (not logged in)
      setHasChecked(true);
    }
  }, [isLoaded, user?.emailAddresses]);
  
  // Loading state - only show if we're actually loading and haven't checked yet
  if (isLoading && !hasChecked) {
    return (
      <div className="pending-invitations">
        <div className="loading-invitations">Loading invitations...</div>
      </div>
    );
  }
  
  // Don't show anything if there are no invitations or we're not logged in
  if (invitations.length === 0) {
    return null;
  }
  
  return (
    <div className="pending-invitations">
      <h3>
        Pending Household Invitations
        {invitations.length > 0 && (
          <span className="invitations-badge">{invitations.length}</span>
        )}
      </h3>
      <ul className="invitations-list">
        {invitations.map((invitation) => (
          <li key={invitation.invitationId} className="invitation-item">
            <div className="invitation-details">
              <div className="invitation-title">
                You've been invited to join "{invitation.householdName}"
              </div>
              <div className="invitation-meta">
                Invited {invitation.invitedAt ? 
                  `on ${invitation.invitedAt.toLocaleDateString()}` : 
                  ''}
              </div>
            </div>
            <div className="invitation-actions">
              <button 
                onClick={() => acceptHouseholdInvitation(
                  invitation.householdId, 
                  invitation.invitationId, 
                  user?.id || '',
                  user?.firstName || '',
                  user?.lastName || ''
                )}
              >
                Accept
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PendingInvitations;