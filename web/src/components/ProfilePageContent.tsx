'use client';

import ProfileForm from '@/components/ProfileForm';
import { useAuth } from '@/context/AuthContext';

export default function ProfilePageContent() {
  const { user } = useAuth();

  if (!user) return null; // Should be handled by ProtectedRoute but extra safety

  return <ProfileForm user={user} />;
}
