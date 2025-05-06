import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Tabs } from '../components/ui/Tabs';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Alert } from '../components/ui/Alert';
import { toast } from 'react-hot-toast';

export const SettingsPage: React.FC = () => {
  const [pharmacyName, setPharmacyName] = useState('PharmaSys Pharmacy');
  const [address, setAddress] = useState('123 Main Street, City, Country');
  const [phone, setPhone] = useState('(123) 456-7890');
  const [email, setEmail] = useState('contact@pharmasys.com');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleGeneralSettingsUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!pharmacyName || !address || !phone || !email) {
      setError('All fields are required');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Settings updated successfully');
    } catch (err) {
      setError('Failed to update settings');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="pb-5 border-b border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Settings
        </h3>
        <p className="mt-2 max-w-4xl text-sm text-gray-500">
          Configure your pharmacy system settings
        </p>
      </div>
      
      <Tabs
        tabs={[
          {
            id: 'general',
            label: 'General',
            content: (
              <Card>
                <CardHeader>
                  <CardTitle>General Settings</CardTitle>
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
                  
                  <form onSubmit={handleGeneralSettingsUpdate} className="space-y-4">
                    <Input
                      label="Pharmacy Name"
                      value={pharmacyName}
                      onChange={(e) => setPharmacyName(e.target.value)}
                      required
                    />
                    
                    <Input
                      label="Address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                    />
                    
                    <Input
                      label="Phone Number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
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
                      Save Settings
                    </Button>
                  </form>
                </CardContent>
              </Card>
            ),
          },
          {
            id: 'notifications',
            label: 'Notifications',
            content: (
              <Card>
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Low Stock Alerts</h4>
                        <p className="text-sm text-gray-500">Notify when inventory items are running low</p>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="lowStockAlerts"
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          defaultChecked
                        />
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Expiry Alerts</h4>
                          <p className="text-sm text-gray-500">Notify about products approaching expiry date</p>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="expiryAlerts"
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                            defaultChecked
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Sales Reports</h4>
                          <p className="text-sm text-gray-500">Receive daily or weekly sales reports</p>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="salesReports"
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                            defaultChecked
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">System Notifications</h4>
                          <p className="text-sm text-gray-500">Receive notifications about system updates</p>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="systemNotifications"
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                            defaultChecked
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <Button>
                        Save Notification Settings
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ),
          },
          {
            id: 'security',
            label: 'Security',
            content: (
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h4>
                        <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="twoFactorAuth"
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Session Timeout</h4>
                          <p className="text-sm text-gray-500">Automatically log out after period of inactivity</p>
                        </div>
                        <select
                          id="sessionTimeout"
                          className="mt-1 block w-40 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                          defaultValue="30"
                        >
                          <option value="15">15 minutes</option>
                          <option value="30">30 minutes</option>
                          <option value="60">1 hour</option>
                          <option value="120">2 hours</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <Button>
                        Save Security Settings
                      </Button>
                    </div>
                  </div>
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