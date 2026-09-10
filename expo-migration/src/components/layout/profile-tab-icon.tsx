import { useCurrentUser, useIsAuthenticated } from '@features/auth';
import { Avatar, AvatarFallbackText } from '@ui/avatar';
import { Icon, LockIcon } from '@ui/icon';

/** Swaps the padlock for the user's initials once they are signed in. */
export function ProfileTabIcon({ focused }: { focused: boolean }) {
  const isAuthenticated = useIsAuthenticated();
  const user = useCurrentUser();

  if (!isAuthenticated || !user) {
    return (
      <Icon
        as={LockIcon}
        size="lg"
        className={focused ? 'text-primary' : 'text-muted-foreground'}
      />
    );
  }

  return (
    <Avatar className={`h-6 w-6 ${focused ? 'border border-primary' : ''}`}>
      <AvatarFallbackText className="text-2xs">{user.displayName}</AvatarFallbackText>
    </Avatar>
  );
}
