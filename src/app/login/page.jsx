'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { userStore } from '../../store/userStore';

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  width: 100vw;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  padding: 16px;
  box-sizing: border-box;
`;

const AuthCard = styled.div`
  background: #ffffff;
  padding: 36px 32px;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 400px;
  box-sizing: border-box;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 8px 0;
  text-align: center;
`;

const Subtitle = styled.p`
  font-size: 14px;
  color: #64748b;
  margin: 0 0 24px 0;
  text-align: center;
`;

const ToggleContainer = styled.div`
  display: flex;
  background: #f1f5f9;
  padding: 4px;
  border-radius: 10px;
  margin-bottom: 24px;
`;

const ToggleButton = styled.button`
  flex: 1;
  padding: 8px 12px;
  border: none;
  background: ${(props) => (props.$active ? '#ffffff' : 'transparent')};
  color: ${(props) => (props.$active ? '#0f172a' : '#64748b')};
  font-weight: ${(props) => (props.$active ? '600' : '400')};
  border-radius: 8px;
  cursor: pointer;
  box-shadow: ${(props) =>
    props.$active ? '0 2px 4px rgba(0,0,0,0.06)' : 'none'};
  transition: all 0.2s ease;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-size: 13px;
  font-weight: 500;
  color: #334155;
`;

const Input = styled.input`
  padding: 10px 14px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 14px;
  color: #0f172a;
  outline: none;
  transition: border-color 0.15s ease;

  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
  }
`;

const SubmitButton = styled.button`
  padding: 12px;
  background: #2563eb;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.15s ease;
  margin-top: 8px;

  &:hover {
    background: #1d4ed8;
  }

  &:disabled {
    background: #94a3b8;
    cursor: not-allowed;
  }
`;

const DemoButton = styled.button`
  padding: 10px;
  background: #f8fafc;
  color: #475569;
  border: 1px dashed #cbd5e1;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s ease;

  &:hover {
    background: #f1f5f9;
  }
`;

const ErrorBanner = styled.div`
  padding: 10px 12px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  border-radius: 8px;
  font-size: 13px;
  margin-bottom: 16px;
`;

const FooterLink = styled(Link)`
  display: block;
  text-align: center;
  font-size: 13px;
  color: #64748b;
  text-decoration: none;
  margin-top: 20px;

  &:hover {
    color: #2563eb;
    text-decoration: underline;
  }
`;

export default function LoginPage() {
  const router = useRouter();
  const setUser = userStore((state) => state.setUser);

  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
    const payload = isRegister ? { name, email, password } : { email, password };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Something went wrong.');
        setLoading(false);
        return;
      }

      setUser(data.user);
      router.push('/');
    } catch {
      setError('Network error. Please try again.');
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'demo@example.com', password: 'password123' }),
      });
      const data = await response.json();
      if (response.ok) {
        setUser(data.user);
        router.push('/');
      } else {
        setError(data.error || 'Demo login failed');
        setLoading(false);
      }
    } catch {
      setError('Network error during demo login.');
      setLoading(false);
    }
  };

  return (
    <Container>
      <AuthCard>
        <Title>Whiteboard</Title>
        <Subtitle>Sign in to save and access your boards</Subtitle>

        <ToggleContainer>
          <ToggleButton
            type="button"
            $active={!isRegister}
            onClick={() => {
              setIsRegister(false);
              setError('');
            }}
          >
            Sign In
          </ToggleButton>
          <ToggleButton
            type="button"
            $active={isRegister}
            onClick={() => {
              setIsRegister(true);
              setError('');
            }}
          >
            Register
          </ToggleButton>
        </ToggleContainer>

        {error && <ErrorBanner>{error}</ErrorBanner>}

        <Form onSubmit={handleSubmit}>
          {isRegister && (
            <FormGroup>
              <Label>Your Name</Label>
              <Input
                type="text"
                required
                placeholder="e.g. Alex Smith"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </FormGroup>
          )}

          <FormGroup>
            <Label>Email Address</Label>
            <Input
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormGroup>

          <FormGroup>
            <Label>Password</Label>
            <Input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormGroup>

          <SubmitButton type="submit" disabled={loading}>
            {loading
              ? 'Processing...'
              : isRegister
              ? 'Create Account'
              : 'Sign In'}
          </SubmitButton>

          {!isRegister && (
            <DemoButton type="button" onClick={handleDemoLogin} disabled={loading}>
              ⚡ 1-Click Demo Sign In (demo@example.com)
            </DemoButton>
          )}
        </Form>

        <FooterLink href="/">← Continue as Guest to Canvas</FooterLink>
      </AuthCard>
    </Container>
  );
}

