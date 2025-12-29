import React from 'react';
import Image from 'next/image';

interface UserAvatarProps {
  user: {
    photoURL?: string | null;
    displayName?: string | null;
    email?: string | null;
  } | null;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ user, size = 'md', className = '' }) => {
  const getInitials = () => {
    if (user?.displayName) {
      return user.displayName.charAt(0).toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-lg',
    lg: 'w-20 h-20 text-2xl',
    xl: 'w-32 h-32 text-4xl',
  };

  return (
    <div
      className={`relative rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-orange-400 to-red-500 text-white font-bold shadow-md ${sizeClasses[size]} ${className}`}
    >
      {user?.photoURL ? (
        <Image
          src={user.photoURL}
          alt={user.displayName || 'User'}
          fill
          className="object-cover"
        />
      ) : (
        <span>{getInitials()}</span>
      )}
    </div>
  );
};

export default UserAvatar;
