import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { BedDouble, Bath, Expand, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Listing } from '@/features/types';

export function ListingCard({ listing, className }: { listing: Listing; className?: string }) {
  return (
    <Link
      to={`/listing/${listing.id}`}
      className={cn('block', className)}>
      <Card className='overflow-hidden transition-shadow hover:shadow-lg'>
        <div className='aspect-video overflow-hidden bg-muted'>
          <img
            src={listing.apartment.images[0]}
            alt={listing.apartment.title}
            className='h-full w-full object-cover'
          />
        </div>
        <div className='space-y-3 p-4'>
          <div className='flex items-start justify-between gap-3'>
            <h3 className='line-clamp-1 text-base font-semibold'>{listing.apartment.title}</h3>
            {listing.apartment.rating && (
              <div className='flex items-center gap-1 text-sm text-amber-500'>
                <Star className='h-4 w-4 fill-amber-400 text-amber-400' /> {listing.apartment.rating}
              </div>
            )}
          </div>
          <div className='text-sm text-muted-foreground line-clamp-1'>
            {listing.apartment.address.country}, {listing.apartment.address.city}
          </div>
          <div className='flex items-center justify-between text-sm'>
            <div className='flex items-center gap-3 text-muted-foreground'>
              <span className='flex items-center gap-1'>
                <BedDouble className='h-4 w-4' /> {listing.apartment.beds} bd
              </span>
              <span className='flex items-center gap-1'>
                <Bath className='h-4 w-4' /> {listing.apartment.baths} ba
              </span>
              <span className='flex items-center gap-1'>
                <Expand className='h-4 w-4' /> {listing.apartment.area} sqft
              </span>
            </div>
            <div className='font-semibold'>${listing.price.toLocaleString()}/mo</div>
          </div>
          {listing.tags && (
            <div className='flex flex-wrap gap-2 pt-1'>
              {listing.tags.map((t) => (
                <Badge
                  key={t}
                  variant='secondary'>
                  {t}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
}
