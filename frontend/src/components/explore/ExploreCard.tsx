import { ExploreItem } from '@/hooks/useExplore';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import Image from 'next/image';
import { Star, MapPin, Calendar } from 'lucide-react';

interface ExploreCardProps {
  item: ExploreItem;
}

export function ExploreCard({ item }: ExploreCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48 w-full">
        <Image
          src={item.imageUrl}
          alt={item.name}
          fill
          className="object-cover"
        />
        <Badge
          className="absolute top-2 right-2"
          variant={
            item.type === 'event'
              ? 'default'
              : item.type === 'restaurant'
              ? 'secondary'
              : 'outline'
          }
        >
          {item.type}
        </Badge>
      </div>

      <CardHeader>
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold">{item.name}</h3>
          {item.rating && (
            <div className="flex items-center">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
              <span className="text-sm">{item.rating}</span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
        
        <div className="mt-4 space-y-2">
          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="h-4 w-4 mr-2" />
            {item.location}
          </div>

          {item.startDate && (
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="h-4 w-4 mr-2" />
              {format(new Date(item.startDate), 'PPP')}
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex justify-between">
        <Badge variant="secondary">{item.category}</Badge>
        {item.price && (
          <span className="text-sm font-medium text-gray-500">
            {item.price}
          </span>
        )}
      </CardFooter>
    </Card>
  );
}
