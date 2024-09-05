import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
    fetchFriends();
    fetchFriendRequests();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('https://user-management-server-opiw.onrender.com/api/user/getAllUsers', {
        headers: { Authorization: localStorage.getItem('token') }
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchFriends = async () => {
    try {
      const response = await axios.get('https://user-management-server-opiw.onrender.com/api/user/getAllFriends', {
        headers: { Authorization: localStorage.getItem('token') }
      });
      setFriends(response.data);
    } catch (error) {
      console.error('Error fetching friends:', error);
    }
  };

  const fetchFriendRequests = async () => {
    try {
      const response = await axios.get('https://user-management-server-opiw.onrender.com/api/user/getFriendReqs', {
        headers: { Authorization: localStorage.getItem('token') }
      });
      setFriendRequests(response.data);
    } catch (error) {
      console.error('Error fetching friend requests:', error);
    }
  };

  const sendFriendRequest = async (userId) => {
    try {
      await axios.post(`https://user-management-server-opiw.onrender.com/api/user/sendFriendReq/${userId}`, {}, {
        headers: { Authorization: localStorage.getItem('token') }
      });
      fetchUsers();
    } catch (error) {
      console.error('Error sending friend request:', error);
    }
  };

  const acceptFriendRequest = async (userId) => {
    try {
      await axios.post(`https://user-management-server-opiw.onrender.com/api/user/acceptRequest/${userId}`, {}, {
        headers: { Authorization: localStorage.getItem('token') }
      });
      fetchUsers();
      fetchFriends();
      fetchFriendRequests();
    } catch (error) {
      console.error('Error accepting friend request:', error);
    }
  };

  const rejectFriendRequest = async (userId) => {
    try {
      await axios.post(`https://user-management-server-opiw.onrender.com/api/user/rejectRequest/${userId}`, {}, {
        headers: { Authorization: localStorage.getItem('token') }
      });
      fetchUsers();
      fetchFriendRequests();
    } catch (error) {
      console.error('Error rejecting friend request:', error);
    }
  };

  const cancelFriendRequest = async (userId) => {
    try {
      await axios.post(`https://user-management-server-opiw.onrender.com/api/user/cancelRequest/${userId}`, {}, {
        headers: { Authorization: localStorage.getItem('token') }
      });
      fetchUsers();
    } catch (error) {
      console.error('Error canceling friend request:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const renderUserAction = (user) => {
    switch(user.status) {
      case 'friend':
        return <span className="text-green-500">Friend</span>;
      case 'incoming_request':
        return (
          <div>
            <button
              onClick={() => acceptFriendRequest(user._id)}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded text-sm mr-2"
            >
              Accept
            </button>
            <button
              onClick={() => rejectFriendRequest(user._id)}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-sm"
            >
              Reject
            </button>
          </div>
        );
      case 'outgoing_request':
        return (
          <button
            onClick={() => cancelFriendRequest(user._id)}
            className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded text-sm"
          >
            Cancel Request
          </button>
        );
      default:
        return (
          <button
            onClick={() => sendFriendRequest(user._id)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-sm"
          >
            Add Friend
          </button>
        );
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl">Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Logout
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <h2 className="text-2xl mb-2">All Users</h2>
          <ul className="bg-white shadow rounded p-4">
            {users.map(user => (
              <li key={user._id} className="mb-2 flex justify-between items-center">
                {user.username}
                {renderUserAction(user)}
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h2 className="text-2xl mb-2">Friend Requests</h2>
          <ul className="bg-white shadow rounded p-4">
            {friendRequests.map(request => (
              <li key={request._id} className="mb-2 flex justify-between items-center">
                {request.username}
                <div>
                  <button
                    onClick={() => acceptFriendRequest(request._id)}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded text-sm mr-2"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => rejectFriendRequest(request._id)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-sm"
                  >
                    Reject
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h2 className="text-2xl mb-2">Friends</h2>
          <ul className="bg-white shadow rounded p-4">
            {friends.map(friend => (
              <li key={friend._id} className="mb-2">
                {friend.username}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;