import { articleSizeBytes, useArticles } from '@features/articles';
import { Button, ButtonText } from '@ui/button';
import { CheckCircleIcon, GlobeIcon, LockIcon } from '@ui/icon';
import { Text } from '@ui/text';
import { VStack } from '@ui/vstack';
import { useState } from 'react';
import { ScrollView } from 'react-native';
import { Screen, SectionLabel, SettingsGroup, SettingsRow } from '@/components/shared';
import { formatBytes, pluralize } from '@/utils/format';
import { LoginForm } from '../components/login-form';
import { ProfileCard } from '../components/profile-card';
import { useSignIn, useSignOut, useSignUp } from '../mutations';
import { useCurrentUser } from '../store';

/**
 * Signed out this tab is the login form; signed in it is the account summary.
 * Auth is mocked for now — swapping in Firebase touches only `mutations.ts`.
 */
export function ProfileScreen() {
  const user = useCurrentUser();
  const articles = useArticles();
  const [mode, setMode] = useState<'sign-in' | 'sign-up'>('sign-in');

  const signIn = useSignIn();
  const signUp = useSignUp();
  const signOut = useSignOut();

  if (!user) {
    const active = mode === 'sign-in' ? signIn : signUp;

    return (
      <Screen edges="top">
        <ScrollView
          contentContainerClassName="px-5 pt-6 pb-10"
          keyboardShouldPersistTaps="handled"
        >
          <VStack className="gap-1 pb-6">
            <Text size="3xl" bold className="text-foreground">
              {mode === 'sign-in' ? 'Welcome back' : 'Create an account'}
            </Text>
            <Text size="sm" className="text-muted-foreground">
              Sign in to sync your articles across devices. Everything works offline
              without an account.
            </Text>
          </VStack>

          <LoginForm
            mode={mode}
            isPending={active.isPending}
            errorMessage={active.error?.message}
            onSubmit={(credentials) => active.mutate(credentials)}
            onToggleMode={() => {
              setMode((current) => (current === 'sign-in' ? 'sign-up' : 'sign-in'));
              signIn.reset();
              signUp.reset();
            }}
          />
        </ScrollView>
      </Screen>
    );
  }

  const totalBytes = articles.reduce(
    (total, article) => total + articleSizeBytes(article),
    0,
  );

  return (
    <Screen edges="top">
      <ScrollView contentContainerClassName="pb-10">
        <ProfileCard user={user} />

        <SectionLabel>Library</SectionLabel>
        <SettingsGroup>
          <SettingsRow
            label="Articles"
            icon={GlobeIcon}
            accessory={
              <Text size="sm" className="text-muted-foreground">
                {pluralize(articles.length, 'article')}
              </Text>
            }
          />
          <SettingsRow
            label="Stored on device"
            icon={CheckCircleIcon}
            accessory={
              <Text size="sm" className="text-muted-foreground">
                {formatBytes(totalBytes)}
              </Text>
            }
          />
          <SettingsRow
            label="Cloud sync"
            description="Arrives with Firebase in a later step"
            icon={LockIcon}
            accessory={
              <Text size="sm" className="text-muted-foreground">
                Soon
              </Text>
            }
          />
        </SettingsGroup>

        <VStack className="px-4 pt-8">
          <Button
            variant="outline"
            size="lg"
            isDisabled={signOut.isPending}
            onPress={() => signOut.mutate()}
          >
            <ButtonText className="text-destructive">Sign out</ButtonText>
          </Button>
        </VStack>
      </ScrollView>
    </Screen>
  );
}
