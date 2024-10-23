import React from 'react';

import Image from 'next/image';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { LikeDialog } from './like-dialog';

interface PromptProps {
  id: Id<'prompts'>;
  question: string;
  answer: string;
  display: boolean;
  liker?: Id<'users'>;
  likee?: Id<'users'>;
  type?: 'like' | 'feed' | 'chat';
}

export function Prompt({
  id,
  answer,
  question,
  display,
  liker,
  likee,
  type,
}: PromptProps) {
  const deletePrompt = useMutation(api.prompts.deletePrompt);

  async function onDelete() {
    await deletePrompt({ promptId: id });
  }

  if (!display) {
    return (
      <div className="relative flex flex-col p-4 text-sm font-bold border rounded-lg shadow-sm border-slate-100">
        <p>{question}</p>
        <p className="pl-2 mt-2 text-gray-500 border-l border-gray-300">
          {answer}
        </p>
        <div
          onClick={onDelete}
          role="button"
          className="absolute p-1 bg-white rounded-full shadow-md -right-1 -top-1"
        >
          <Image
            src="/x.svg"
            width={14}
            height={14}
            alt="close icon"
            className=""
          />
        </div>
      </div>
    );
  }

  return (
    <div className="relative px-4 py-16 space-y-4 rounded-lg dark:bg-secondary bg-purple-50 ">
      <p className="font-semibold text-md">{question}</p>
      <h2 className="text-3xl font-bold">{answer}</h2>
      {type !== 'chat' && (
        <LikeDialog
          itemId={id}
          type="prompt"
          liker={liker}
          likee={likee}
          question={question}
          answer={answer}
        />
      )}
    </div>
  );
}
