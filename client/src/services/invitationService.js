import axios from "axios";

const API_URL =
  "http://localhost:5000/api/invitations";

const getToken = () =>
  localStorage.getItem("token");

// Invite a user
export const inviteUser = async (
  workspaceId,
  receiverId
) => {
  const response = await axios.post(
    API_URL,
    {
      workspaceId,
      receiverId,
    },
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  return response.data;
};

// Get pending invitations
export const getInvitations =
  async () => {
    const response =
      await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

    return response.data;
  };

// Accept invitation
export const acceptInvitation =
  async (id) => {
    const response =
      await axios.put(
        `${API_URL}/${id}/accept`,
        {},
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

    return response.data;
  };

// Reject invitation
export const rejectInvitation =
  async (id) => {
    const response =
      await axios.put(
        `${API_URL}/${id}/reject`,
        {},
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

    return response.data;
  };