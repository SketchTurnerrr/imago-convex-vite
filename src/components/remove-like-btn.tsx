import { X } from 'lucide-react';
import { Button } from './ui/button';

export function RemoveLikeBtn() {
  return (
    <Button className="rounded-full w-14 h-14" size="icon">
      <X className="w-8 h-8" />
    </Button>
  );
}
