import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@/features/auth/authSlice';
import { useUpdateProfileMutation, useChangePasswordMutation } from '../api/profileApiSlice';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

const ProfilePage: React.FC = () => {
  const user = useSelector(selectCurrentUser);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [reNewPassword, setReNewPassword] = useState('');

  const [profileMessage, setProfileMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [updateProfile, { isLoading: isUpdatingProfile }] = useUpdateProfileMutation();
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setEmail(user.email);
    }
  }, [user]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMessage(null);
    try {
      await updateProfile({ username, email }).unwrap();
      setProfileMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err) {
      setProfileMessage({ type: 'error', text: 'Failed to update profile.' });
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage(null);
    if (newPassword !== reNewPassword) {
      setPasswordMessage({ type: 'error', text: "New passwords don't match!" });
      return;
    }
    try {
      await changePassword({ current_password: currentPassword, new_password: newPassword }).unwrap();
      setPasswordMessage({ type: 'success', text: 'Password changed successfully!' });
      setCurrentPassword('');
      setNewPassword('');
      setReNewPassword('');
    } catch (err) {
      setPasswordMessage({ type: 'error', text: 'Failed to change password. Check your current password.' });
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">My Profile</h1>

      <Card>
        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <h2 className="text-xl font-semibold">Personal Information</h2>
          {profileMessage && (
            <p className={profileMessage.type === 'success' ? 'text-green-600' : 'text-red-600'}>
              {profileMessage.text}
            </p>
          )}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
            <input type="text" name="username" id="username" value={username} onChange={(e) => setUsername(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" name="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={isUpdatingProfile}>
              {isUpdatingProfile ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </Card>

      <Card>
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <h2 className="text-xl font-semibold">Change Password</h2>
          {passwordMessage && (
            <p className={passwordMessage.type === 'success' ? 'text-green-600' : 'text-red-600'}>
              {passwordMessage.text}
            </p>
          )}
          <div>
            <label htmlFor="current_password" className="block text-sm font-medium text-gray-700">Current Password</label>
            <input type="password" name="current_password" id="current_password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
          </div>
          <div>
            <label htmlFor="new_password" className="block text-sm font-medium text-gray-700">New Password</label>
            <input type="password" name="new_password" id="new_password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
          </div>
          <div>
            <label htmlFor="re_new_password" className="block text-sm font-medium text-gray-700">Confirm New Password</label>
            <input type="password" name="re_new_password" id="re_new_password" value={reNewPassword} onChange={(e) => setReNewPassword(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={isChangingPassword}>
              {isChangingPassword ? 'Saving...' : 'Change Password'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ProfilePage;
