import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect, useState } from "react";
import axios from 'axios';
import { ButtonToHome } from "../Buttons";


type UserData = {
  username: string;
  email: string;
  authId: string;
  // Add other user data properties as needed
}

const ProfilePage: React.FC<{ userData: UserData | null }> = () => {
  const { user, isAuthenticated } = useAuth0();
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Check if the user exists by sending a POST request instead of a GET request
        const response = await axios.post<UserData>("/Users", {
          username: user?.name,
          email: user?.email,
          authId: user?.sub,
          // Include other user data properties you want to save
        });
        setUserData(response.data);
        // console.log(response);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (isAuthenticated && user) {
      fetchUserData();
    }
  }, []);
  console.log(userData, "USeRdatA");

  

  if (!user) {
    return null;
  }

  return (
    <div className="content-layout">
      <h1 id="page-title" className="content__title">
        Profile
      </h1>
      <ButtonToHome />
      <div className="content__body">
        <p id="page-description">
          <span>
          </span>
          <span>
            <strong></strong>
          </span>
        </p>
        <div className="profile-grid">
          <div className="profile__header">
            <img src={user.picture} alt="Profile" className="profile__avatar" />
            <div className="profile__headline">
              <h2 className="profile__title">{user.name}</h2>
              <span className="profile__description">{user.email}</span>
            </div>
          </div>
          <div className="profile__details">
            <h2>Decoded ID Token from authenticated user</h2>
            <p>{JSON.stringify(user, null, 2)}</p>
            <h2>userData from database</h2>
            <p>{JSON.stringify(userData, null, 2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
