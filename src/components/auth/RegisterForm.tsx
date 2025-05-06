import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as lucide from 'lucide-react';

import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { Alert } from '../ui/Alert';
import { useAuthStore } from '../../store/authStore';
import { Select } from '../ui/Select';

export const RegisterForm: React.FC = () => {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rol, setRol] = useState('Gerente');
  const [error, setError] = useState<string | null>(null);
  
  const { register, isLoading } = useAuthStore();
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    try {
      await register(nombre, apellido, email, password, rol);
      navigate('/dashboard');
    } catch (err) {
      setError('Registration failed. Please try again.');
    }
  };
  
  return (
    <div className="max-w-md w-full mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Create an Account</CardTitle>
          <CardDescription>
            Register to start using PharmaSys
          </CardDescription>
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
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="First Name"
              type="text"
              id="nombre"
              placeholder="John"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              leftIcon={<lucide.User size={18} />}
            />
            
            <Input
              label="Last Name"
              type="text"
              id="apellido"
              placeholder="Doe"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
              required
              leftIcon={<lucide.User size={18} />}
            />
            
            <Input
              label="Email"
              type="email"
              id="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              leftIcon={<lucide.AtSign size={18} />}
            />
            
            <Input
              label="Password"
              type="password"
              id="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              leftIcon={<lucide.Lock size={18} />}
              hint="Password must be at least 8 characters"
            />
            
            <Input
              label="Confirm Password"
              type="password"
              id="confirmPassword"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              leftIcon={<lucide.Lock size={18} />}
            />
            
            <Select
              label="Role"
              id="rol"
              value={rol}
              onChange={(e) => setRol(e.target.value)}
              options={[
                { value: 'Gerente', label: 'Manager' },
                { value: 'Empleado', label: 'Employee' },
                { value: 'Farmaceutico', label: 'Pharmacist' },
              ]}
              required
            />
            
            <Button
              type="submit"
              className="w-full"
              isLoading={isLoading}
            >
              Create Account
            </Button>
          </form>
          
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <a 
                onClick={() => navigate('/login')}
                className="font-medium text-primary-600 hover:text-primary-500 cursor-pointer"
              >
                Sign in
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};