import { Button, ButtonSpinner, ButtonText } from '@ui/button';
import { HStack } from '@ui/hstack';
import { EyeIcon, EyeOffIcon, LockIcon, MailIcon } from '@ui/icon';
import { Input, InputField, InputIcon, InputSlot } from '@ui/input';
import { Pressable } from '@ui/pressable';
import { Text } from '@ui/text';
import { VStack } from '@ui/vstack';
import { useState } from 'react';
import { credentialsSchema } from '../types/user';

type LoginFormProps = {
  mode: 'sign-in' | 'sign-up';
  isPending: boolean;
  errorMessage?: string | undefined;
  onSubmit: (credentials: { email: string; password: string }) => void;
  onToggleMode: () => void;
};

/** Email/password form shared by sign-in and sign-up; validated with zod. */
export function LoginForm({
  mode,
  isPending,
  errorMessage,
  onSubmit,
  onToggleMode,
}: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const submit = () => {
    const parsed = credentialsSchema.safeParse({ email: email.trim(), password });
    if (!parsed.success) {
      setValidationError(parsed.error.issues[0]?.message ?? 'Check your details.');
      return;
    }
    setValidationError(null);
    onSubmit(parsed.data);
  };

  const message = validationError ?? errorMessage;

  return (
    <VStack className="gap-3">
      <Input className="h-14 border-input bg-card">
        <InputSlot className="pl-3">
          <InputIcon as={MailIcon} className="text-muted-foreground" />
        </InputSlot>
        <InputField
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          className="text-foreground"
        />
      </Input>

      <Input className="h-14 border-input bg-card">
        <InputSlot className="pl-3">
          <InputIcon as={LockIcon} className="text-muted-foreground" />
        </InputSlot>
        <InputField
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          secureTextEntry={!showPassword}
          autoCapitalize="none"
          returnKeyType="go"
          onSubmitEditing={submit}
          className="text-foreground"
        />
        <InputSlot className="pr-3">
          <Pressable
            onPress={() => setShowPassword((visible) => !visible)}
            accessibilityRole="button"
            accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
            hitSlop={8}
          >
            <InputIcon
              as={showPassword ? EyeOffIcon : EyeIcon}
              className="text-muted-foreground"
            />
          </Pressable>
        </InputSlot>
      </Input>

      {message ? (
        <Text size="sm" className="text-destructive">
          {message}
        </Text>
      ) : null}

      <Button onPress={submit} isDisabled={isPending} size="lg" className="mt-1 h-14">
        {isPending ? <ButtonSpinner /> : null}
        <ButtonText>{mode === 'sign-in' ? 'Sign in' : 'Create account'}</ButtonText>
      </Button>

      <HStack className="items-center justify-center gap-1 pt-1">
        <Text size="sm" className="text-muted-foreground">
          {mode === 'sign-in' ? 'No account yet?' : 'Already have an account?'}
        </Text>
        <Pressable onPress={onToggleMode} accessibilityRole="button" hitSlop={8}>
          <Text size="sm" bold className="text-primary">
            {mode === 'sign-in' ? 'Sign up' : 'Sign in'}
          </Text>
        </Pressable>
      </HStack>
    </VStack>
  );
}
