import { Avatar, AvatarFallbackText, AvatarImage } from '@ui/avatar';
import { Text } from '@ui/text';
import { VStack } from '@ui/vstack';
import type { User } from '../types/user';

export function ProfileCard({ user }: { user: User }) {
  return (
    <VStack className="items-center gap-3 px-6 py-6">
      <Avatar className="h-20 w-20">
        <AvatarFallbackText className="text-2xl">{user.displayName}</AvatarFallbackText>
        {user.photoUrl ? <AvatarImage source={{ uri: user.photoUrl }} /> : null}
      </Avatar>
      <VStack className="items-center gap-0.5">
        <Text size="xl" bold className="text-foreground">
          {user.displayName}
        </Text>
        <Text size="sm" className="text-muted-foreground">
          {user.email}
        </Text>
      </VStack>
    </VStack>
  );
}
