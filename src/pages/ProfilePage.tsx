import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui/Alert';
import { Tabs } from '../components/ui/Tabs';
import { useAuthStore } from '../store/authStore';
import { toast } from 'react-hot-toast';

export const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuthStore();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!name || !email) {
      setError('Name and email are required');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      updateProfile({ name, email });
      toast.success('Profile updated successfully');
    } catch (err) {
      setError('Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!currentPassword) {
      setError('Current password is required');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    
    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // This is just a mock as we don't actually change passwords in this demo
      toast.success('Password changed successfully');
      
      // Reset form
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError('Failed to change password');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="pb-5 border-b border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          User Profile
        </h3>
        <p className="mt-2 max-w-4xl text-sm text-gray-500">
          Manage your personal information and account security
        </p>
      </div>
      
      <Tabs
        tabs={[
          {
            id: 'profile',
            label: 'Profile Information',
            content: (
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                </CardHeader>
                <CardContent>
                  {error && (
                    <Alert 
                      variant="error" 
                      className="mb-4"
                      onClose={() => setError(null)}
                    >
                      {error}
                    </Alert>
                  )}
                  
                  <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <div className="flex items-center mb-4">
                      <div className="h-20 w-20 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-2xl mr-4">
                        {user?.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-lg font-medium">{user?.name}</h3>
                        <p className="text-sm text-gray-500">{user?.role.charAt(0).toUpperCase() + user?.role.slice(1)}</p>
                      </div>
                    </div>
                    
                    <Input
                      label="Full Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                    
                    <Input
                      label="Email Address"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    
                    <Button
                      type="submit"
                      isLoading={isSubmitting}
                    >
                      Update Profile
                    </Button>
                  </form>
                </CardContent>
              </Card>
            ),
          },
          {
            id: 'password',
            label: 'Change Password',
            content: (
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                </CardHeader>
                <CardContent>
                  {error && (
                    <Alert 
                      variant="error" 
                      className="mb-4"
                      onClose={() => setError(null)}
                    >
                      {error}
                    </Alert>
                  )}
                  
                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <Input
                      label="Current Password"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                    />
                    
                    <Input
                      label="New Password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      hint="Password must be at least 8 characters"
                    />
                    
                    <Input
                      label="Confirm New Password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                    
                    <Button
                      type="submit"
                      isLoading={isSubmitting}
                    >
                      Change Password
                    </Button>
                  </form>
                </CardContent>
              </Card>
            ),
          },
        ]}
        className="mt-6"
      />
    </div>
  );
};