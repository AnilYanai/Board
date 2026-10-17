'use client';

import React, { useEffect } from 'react';
import Undo from '../assets/undo.svg';
import Redo from '../assets/redo.svg';
import styled from "styled-components";
import Link from 'next/link';
import { useActionBar } from '../hooks/useActionBar';
import { userStore } from '../store/userStore';

const StyledDiv = styled.div`
  position: fixed;
  right: 16px;
  top: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 100;
`;

const ActionButton = styled.button`
  background: transparent;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 6px 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 500;
  color: #334155;
  transition: all 0.15s ease;

  &:hover {
    background: #f1f5f9;
  }
`;

const Img = styled.img`
  width: 15px;
  height: 15px;
`;

const UserBadge = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: #1e293b;
  padding: 4px 8px;
  background: #f1f5f9;
  border-radius: 6px;
`;

const AuthLink = styled(Link)`
  text-decoration: none;
  font-size: 13px;
  font-weight: 600;
  color: #ffffff;
  background: #2563eb;
  padding: 6px 12px;
  border-radius: 6px;
  transition: background-color 0.15s ease;

  &:hover {
    background: #1d4ed8;
  }
`;

function ActionBar() {
  const { undo, redo, saveCanvas } = useActionBar();
  const user = userStore((state) => state.user);
  const checkAuth = userStore((state) => state.checkAuth);
  const logout = userStore((state) => state.logout);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <StyledDiv>
      <ActionButton onClick={undo} title="Undo">
        <Img src={Undo.src || Undo} alt="Undo" />
      </ActionButton>
      <ActionButton onClick={redo} title="Redo">
        <Img src={Redo.src || Redo} alt="Redo" />
      </ActionButton>
      <ActionButton onClick={saveCanvas} title="Save to PNG">
        Save
      </ActionButton>

      {user ? (
        <>
          <UserBadge title={user.email}>{user.name || user.email}</UserBadge>
          <ActionButton onClick={logout} title="Sign Out">
            Logout
          </ActionButton>
        </>
      ) : (
        <AuthLink href="/login">Login</AuthLink>
      )}
    </StyledDiv>
  );
}

export default ActionBar;