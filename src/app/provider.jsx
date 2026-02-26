// app/providers.tsx - Add this to your existing file
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// ... existing code ...

// Export the context for use in hooks
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}