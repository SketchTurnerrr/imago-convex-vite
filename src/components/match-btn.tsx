import { useState } from 'react';
import { Button } from './ui/button';
import MatchIcon from '@/public/hand-waving.svg';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from './ui/dialog';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import Image from 'next/image';
import { Textarea } from './ui/textarea';
import { Id } from '@/convex/_generated/dataModel';

export function MatchBtn({
  likeId,
  receiverId,
}: {
  likeId: Id<'likes'> | undefined;
  receiverId: Id<'users'>;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [comment, setComment] = useState('');

  if (!likeId || !receiverId) return null;

  const likeData = useQuery(api.matches.getLikeForMatch, { likeId });
  const createMatch = useMutation(api.matches.createMatch);

  const gender = likeData?.liker.gender === 'male' ? 'вподобав' : 'вподобала';
  const type = likeData?.like.itemType === 'photo' ? 'фото' : 'відповідь';
  const conjunction = likeData?.like.itemType === 'photo' ? 'ваше ' : 'вашу ';

  const handleMatch = async () => {
    try {
      const { matchId, conversationId } = await createMatch({
        receiverId,
        likeId,
        comment,
      });
      setIsOpen(false);

      // Here you could navigate to the new conversation if you want
      // router.push(`/conversations/${conversationId}`);
    } catch (error) {
      console.log('error :', error);
    }
  };

  return (
    <>
      <Button
        className="rounded-full w-14 h-14"
        size="icon"
        onClick={() => setIsOpen(true)}
      >
        <MatchIcon />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{likeData?.liker.name}</DialogTitle>
            <DialogDescription>
              Цей користувач {gender} {conjunction}
              {type}. Хочете створити метч?
            </DialogDescription>
          </DialogHeader>

          {likeData?.liker.photo && (
            <div className="flex justify-center">
              <Image
                src={likeData.liker.photo.url}
                alt={likeData.liker.name || 'alt'}
                width={200}
                height={200}
                className="rounded-full"
              />
            </div>
          )}

          <Textarea
            placeholder="Можна додати коментар"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Скасувати
            </Button>
            <Button onClick={handleMatch}>Познайомитися</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
