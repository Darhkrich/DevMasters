'use client'; // Required if using App Router for state and interactivity

import { useState } from 'react';
import Image from 'next/image';
import styles from './styles.css'; // adjust path

export default function ProfilePage() {
  // Mock user data – replace with real data from your auth/API
  const [user, setUser] = useState({
    avatar: '/avatars/default.jpg', // placeholder
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'Client',
    bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...user });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = () => {
    // TODO: Send updated data to your backend
    setUser(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(user);
    setIsEditing(false);
  };

  return (
    <div className="profileContainer">
      <h1 className="pageTitle">Profile</h1>

      <div className="profileCard">
        {/* Avatar Section */}
        <div className="avatarSection">
          <div className="avatarWrapper">
            <Image
              src={user.avatar}
              alt={user.name}
              width={120}
              height={120}
              className="avatar"
            />
            {isEditing && (
              <button className="changeAvatarBtn">
                Change
              </button>
            )}
          </div>
          <h2 className="userName">{user.name}</h2>
          <p className="userRole">{user.role}</p>
        </div>

        {/* Profile Form */}
        <div className="formSection">
          <div className="formGroup">
            <label htmlFor="name">Full Name</label>
            {isEditing ? (
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="input"
              />
            ) : (
              <p className="staticValue">{user.name}</p>
            )}
          </div>

          <div className="formGroup">
            <label htmlFor="email">Email</label>
            {isEditing ? (
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="input"
              />
            ) : (
              <p className="staticValue">{user.email}</p>
            )}
          </div>

          <div className="formGroup">
            <label htmlFor="bio">Bio</label>
            {isEditing ? (
              <textarea
                id="bio"
                name="bio"
                rows="4"
                value={formData.bio}
                onChange={handleInputChange}
                className="textarea"
              />
            ) : (
              <p className="staticValue">{user.bio}</p>
            )}
          </div>

          {/* Change Password Section (always visible) */}
          <div className="formGroup">
            <label>Password</label>
            <button className="changePasswordBtn">
              Change Password
            </button>
          </div>

          {/* Action Buttons */}
          <div className="actions">
            {isEditing ? (
              <>
                <button onClick={handleSave} className="btn btnPrimary">
                  Save Changes
                </button>
                <button onClick={handleCancel} className="btn btnSecondary">
                  Cancel
                </button>
              </>
            ) : (
              <button onClick={() => setIsEditing(true)} className="btn btnPrimary">
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}