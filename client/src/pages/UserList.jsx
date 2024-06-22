import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../public/styles/UserList.css";
import StarRating from "../components/Raiting/StarRating";

function UserList() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          "http://localhost:3001/auth/user-ranking",
          {
            credentials: "include",
          }
        );
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        } else {
          throw new Error("Failed to fetch users");
        }
      } catch (error) {
        console.error("Failed to load users:", error);
        setError("Failed to load users");
      }
    };
    fetchUsers();
  }, []);

  const handleUserClick = (userId) => {
    navigate(`/user-profile/${userId}`);
  };

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="userlist-cont">
    <h1 className="userlist-title">Ƶigarxoyn reiting</h1>
    {users.length > 0 ? (
      users.map((user, index) => (
        <div
          key={user._id}
          className={`user-card ${index < 3 ? "top-user" : ""}`}
          onClick={() => handleUserClick(user._id)}
        >
            <p className="user-info">
            {user.username}
            </p>
          <p className="post-info">Posts: {user.postCount}</p>
          <StarRating likeCount={user.likeCount} />
        </div>
      ))
    ) : (
      <div className="noUsers">No users found</div>
    )}
  </div>
  );
}

export default UserList;
