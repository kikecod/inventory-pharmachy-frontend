import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';

export const CustomersPage: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="pb-5 border-b border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Customer Management
        </h3>
        <p className="mt-2 max-w-4xl text-sm text-gray-500">
          Manage customer information and purchase history
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Customer Management</CardTitle>
          <CardDescription>
            This feature will be implemented in the next version.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-6 text-center">
            <p className="text-gray-500">
              The customer management feature is coming soon. This will allow you to:
            </p>
            <ul className="list-disc list-inside text-left mt-4 space-y-2 max-w-md mx-auto">
              <li>Store and manage customer contact information</li>
              <li>Track purchase history and medications</li>
              <li>Implement loyalty programs and discounts</li>
              <li>Set up prescription reminders and refill notifications</li>
              <li>Analyze customer purchase patterns</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};