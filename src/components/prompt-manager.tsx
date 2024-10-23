import React from 'react';
import { Prompt } from './prompt';
import { Button } from '@/components/ui/button';
import { CreatePromptDialog } from './create-prompt';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useCurrentUser } from '@/app/hooks/useCurrentUser';

interface PromptManagerProps {
  onComplete: () => void;
}

export function PromptManager({ onComplete }: PromptManagerProps) {
  const { isLoading, isAuthenticated, user } = useCurrentUser();
  const dbPrompts = useQuery(
    api.prompts.getUserPrompts,
    isAuthenticated ? {} : 'skip'
  );

  console.log('isAuthenticated :', isAuthenticated);
  if (isLoading) {
    return <div>Loading</div>;
  }

  if (user) {
    console.log('user :', user);
  }

  if (!dbPrompts) {
    return null;
  }

  const isComplete = dbPrompts.length === 3;

  return (
    <div className="flex flex-col h-full space-y-4">
      <h1 className="mt-20 mb-4 text-4xl font-bold">Додайте три фрази</h1>
      {dbPrompts.map((prompt) => (
        <Prompt
          likee={prompt.userId}
          key={prompt._id}
          id={prompt._id}
          display={false}
          answer={prompt.answer}
          question={prompt.question}
        />
      ))}
      {dbPrompts.length < 3 && <CreatePromptDialog />}
      <p className="text-sm font-semibold text-gray-400">мінімум 3 фрази.</p>
      <Button
        onClick={onComplete}
        disabled={!isComplete}
        className="self-end"
        style={{ marginTop: 'auto' }}
      >
        {isComplete
          ? 'Далі'
          : `Додайте ще ${3 - dbPrompts.length}  ${dbPrompts.length === 2 ? ' фразу' : ' фрази'}`}
      </Button>
    </div>
  );
}
