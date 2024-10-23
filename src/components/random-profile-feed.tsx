import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Cross from '@/public/cross.svg';
import { FunctionReturnType } from 'convex/server';
import { api } from '@/convex/_generated/api';
import { differenceInYears, parse } from 'date-fns';
import { ArrowRight, CakeIcon, MapPin } from 'lucide-react';
import { Id } from '@/convex/_generated/dataModel';
import { LikeDialog } from './like-dialog';
import { Prompt } from './prompt';
import { RemoveLikeBtn } from './remove-like-btn';
import { MatchBtn } from './match-btn';

interface ProfileProps {
  type: 'like' | 'feed' | 'chat';
  likeId?: Id<'likes'>;
  profile: FunctionReturnType<typeof api.profiles.getRandomProfile>;
  onNextProfile?: () => void;
  currentUserId?: Id<'users'>;
}

function PhotoComponent({
  type,
  photo,
  name,
  currentUserId,
  profileId,
}: {
  type: 'like' | 'feed' | 'chat';
  photo: {
    _id: Id<'photos'>;
    userId: Id<'users'>;
    url: string;
    order: number;
  };
  name: string | undefined;
  currentUserId?: Id<'users'>;
  profileId: Id<'users'>;
}) {
  return (
    <div className="relative">
      <Image
        src={photo?.url}
        alt={`${name}'s photo`}
        width={1000}
        height={1100}
        className="w-full h-auto rounded-lg"
      />
      {type !== 'chat' && (
        <LikeDialog
          itemId={photo._id}
          type="photo"
          liker={currentUserId}
          likee={profileId}
          url={photo.url}
          name={name}
        />
      )}
    </div>
  );
}

function PromptComponent({
  prompt,
  currentUserId,
  profileId,
  type,
}: {
  type: 'like' | 'feed' | 'chat';
  prompt: {
    _id: Id<'prompts'>;
    userId: Id<'users'>;
    question: string;
    answer: string;
  };
  currentUserId?: Id<'users'>;
  profileId: Id<'users'>;
}) {
  return (
    <Prompt
      type={type}
      question={prompt.question}
      answer={prompt.answer}
      display={true}
      liker={currentUserId}
      likee={profileId}
      id={prompt._id}
    />
  );
}

export function Profile({
  profile,
  type,
  likeId,
  currentUserId,
  onNextProfile,
}: ProfileProps) {
  if (!profile) {
    return <div>Something went wrong</div>;
  }

  const sortedPhotos = profile.photos.sort((a, b) => a.order - b.order);
  const sortedPrompts = profile.prompts.slice(0, 3);

  console.log('onboarded :', profile.onboarded);
  console.log('gender :', profile.gender);

  console.log(' name:', profile.name);
  const calculateAge = (dob: string | undefined) => {
    if (!dob) return;
    const parsedDate = parse(dob, 'dd.MM.yyyy', new Date());
    return differenceInYears(new Date(), parsedDate);
  };

  const age = calculateAge(profile.dob);

  return (
    <>
      <Card className="w-full max-w-md md:max-w-lg mx-auto mb-[120px] rounded-none border-none bg-[hsl(0, 0%, 12%)] shadow-none">
        <CardHeader className="px-4 pb-0">
          <CardTitle className="text-4xl">{profile.name}</CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          {sortedPhotos[0] && (
            <PhotoComponent
              type={type}
              photo={sortedPhotos[0]}
              name={profile.name}
              currentUserId={currentUserId}
              profileId={profile._id}
            />
          )}
          <Image
            src={'https://picsum.photos/1200/1900'}
            alt={`${name}'s photo`}
            width={1000}
            height={1000}
            className="w-full h-auto rounded-lg"
          />

          <div className="flex justify-between p-4 text-base font-semibold rounded-lg bg-purple-50 dark:bg-secondary">
            <span className="flex items-center gap-2">
              <CakeIcon />
              {age}
            </span>

            <span className="flex items-center gap-2">
              <Cross />
              {profile.denomination}
            </span>
            <span className="flex items-center gap-2">
              <MapPin className="w-6 h-6" />
              {profile.custom_location
                ? profile.custom_location
                : profile.location}
            </span>
          </div>
          {sortedPrompts[0] && (
            <PromptComponent
              type={type}
              prompt={sortedPrompts[0]}
              currentUserId={currentUserId}
              profileId={profile._id}
            />
          )}

          {sortedPhotos[1] && (
            <PhotoComponent
              type={type}
              photo={sortedPhotos[1]}
              name={profile.name}
              currentUserId={currentUserId}
              profileId={profile._id}
            />
          )}
          <Image
            src={'https://picsum.photos/1100/1200'}
            alt={`${name}'s photo`}
            width={1000}
            height={1000}
            className="w-full h-auto rounded-lg"
          />

          {sortedPhotos[2] && (
            <PhotoComponent
              type={type}
              photo={sortedPhotos[2]}
              name={profile.name}
              currentUserId={currentUserId}
              profileId={profile._id}
            />
          )}

          {sortedPrompts[1] && (
            <PromptComponent
              type={type}
              prompt={sortedPrompts[1]}
              currentUserId={currentUserId}
              profileId={profile._id}
            />
          )}

          {sortedPhotos[3] && (
            <PhotoComponent
              type={type}
              photo={sortedPhotos[3]}
              name={profile.name}
              currentUserId={currentUserId}
              profileId={profile._id}
            />
          )}

          {sortedPrompts[2] && (
            <PromptComponent
              type={type}
              prompt={sortedPrompts[2]}
              currentUserId={currentUserId}
              profileId={profile._id}
            />
          )}

          {sortedPhotos[4] && (
            <PhotoComponent
              type={type}
              photo={sortedPhotos[4]}
              name={profile.name}
              currentUserId={currentUserId}
              profileId={profile._id}
            />
          )}

          {sortedPhotos[5] && (
            <PhotoComponent
              type={type}
              photo={sortedPhotos[5]}
              name={profile.name}
              currentUserId={currentUserId}
              profileId={profile._id}
            />
          )}
        </CardContent>
      </Card>

      {type !== 'chat' && (
        <div className="fixed left-0 right-0 flex justify-between px-8 space-x-4 bottom-20 md:justify-around md:bottom-10">
          {type === 'feed' ? (
            <Button
              onClick={onNextProfile}
              size="icon"
              className="flex items-center justify-center rounded-full w-14 h-14"
            >
              <ArrowRight className="w-8 h-8" />
            </Button>
          ) : (
            <RemoveLikeBtn />
          )}
          {type === 'feed' ? (
            <div
              role="none"
              aria-description="empty div to fill up space"
            ></div>
          ) : (
            <MatchBtn likeId={likeId} receiverId={profile._id} />
          )}
        </div>
      )}
    </>
  );
}
