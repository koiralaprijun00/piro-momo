import ProfileForm from '@/components/ProfileForm';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/context/AuthContext'; // Note: This import isn't used here directly if I keep this server-side, but I need to pass user to ProfileForm. 
// Wait, ProfileForm needs user object. ProtectedRoute ensures user exists, but ProfileForm would get user from context probably?
// Let's modify ProfileForm to get user from context instead of props, or pass it from a wrapper that knows about the user.

// Actually, let's create a Client Component wrapper for the content of this page.
import ProfilePageContent from '@/components/ProfilePageContent';

export default async function ProfilePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return (
    <ProtectedRoute locale={locale}>
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
         <ProfilePageContent />
      </div>
    </ProtectedRoute>
  );
}
