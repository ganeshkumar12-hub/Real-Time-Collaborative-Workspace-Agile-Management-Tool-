import { useEffect, useState } from "react";

import {
  getInvitations,
  acceptInvitation,
  rejectInvitation,
} from "../services/invitationService";

function Invitations() {
  const [invitations, setInvitations] = useState([]);

  const loadInvitations = async () => {
    try {
      const data = await getInvitations();
      setInvitations(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchInvitations = async () => {
      try {
        const data = await getInvitations();
        setInvitations(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchInvitations();
  }, []);

  const handleAccept = async (id) => {
    try {
      await acceptInvitation(id);

      alert("Invitation Accepted");

      loadInvitations();
    } catch (error) {
      alert(error.response?.data?.message || "Error");
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectInvitation(id);

      alert("Invitation Rejected");

      loadInvitations();
    } catch (error) {
      alert(error.response?.data?.message || "Error");
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1>Pending Invitations</h1>

      {invitations.length === 0 ? (
        <p>No Pending Invitations</p>
      ) : (
        invitations.map((invite) => (
          <div
            key={invite._id}
            style={{
              background: "#1e293b",
              color: "white",
              padding: "15px",
              borderRadius: "10px",
              marginBottom: "15px",
            }}
          >
            <h3>{invite.workspace.name}</h3>

            <p>
              Invited By: {invite.sender.name}
            </p>

            <button
              onClick={() =>
                handleAccept(invite._id)
              }
            >
              Accept
            </button>

            <button
              onClick={() =>
                handleReject(invite._id)
              }
              style={{
                marginLeft: "10px",
              }}
            >
              Reject
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default Invitations;