import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { BedDouble, Bath, Expand, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Listing } from '@/features/types';
import { S3_URL } from '@/consts';
import { useEffect, useRef, useState } from 'react';

export function ListingCard({ listing, className }: { listing: Listing; className?: string }) {
  const pics = listing.apartment.pictures || [];
  const hasMultiple = pics.length > 1;
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller || !hasMultiple) return;
    const handler = () => {
      const idx = Math.round(scroller.scrollLeft / scroller.clientWidth);
      setActive(Math.max(0, Math.min(idx, pics.length - 1)));
    };
    scroller.addEventListener('scroll', handler, { passive: true });
    return () => scroller.removeEventListener('scroll', handler as any);
  }, [hasMultiple, pics.length]);

  const goTo = (idx: number) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    scroller.scrollTo({ left: idx * scroller.clientWidth, behavior: 'smooth' });
  };

  return (
    <Link
      to={`/listing/${listing.id}`}
      className={cn('block', className)}>
      <Card className='overflow-hidden py-0 transition-shadow hover:shadow-lg'>
        <div className='relative aspect-video overflow-hidden bg-muted'>
          {hasMultiple ? (
            <div
              ref={scrollerRef}
              className='h-full w-full overflow-x-auto overflow-y-hidden whitespace-nowrap [scrollbar-width:none] [-ms-overflow-style:none] [scrollbar-color:transparent_transparent] scroll-smooth'
              style={{ scrollbarWidth: 'none' }}
            >
              <div className='flex h-full w-full snap-x snap-mandatory'>
                {pics.map((p, i) => (
                  <div key={p.id || i} className='h-full w-full flex-shrink-0 snap-center'>
                    <img
                      src={p.url ? `${S3_URL}/${p.url}` : '/placeholder.svg'}
                      alt={listing.apartment.title}
                      className='block h-full w-full object-cover'
                      loading={i === 0 ? 'eager' : 'lazy'}
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <img
              src={pics[0]?.url ? `${S3_URL}/${pics[0].url}` : '/placeholder.svg'}
              alt={listing.apartment.title}
              className='block h-full w-full object-cover'
            />
          )}
          {hasMultiple && (
            <div className='pointer-events-none absolute inset-x-0 bottom-2 flex items-center justify-center gap-1'>
              {pics.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); goTo(i); }}
                  className={cn('h-1.5 w-1.5 rounded-full transition', i === active ? 'bg-white' : 'bg-white/50')}
                  aria-label={`Go to image ${i + 1}`}
                  style={{ pointerEvents: 'auto' }}
                />
              ))}
            </div>
          )}
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
                <Expand className='h-4 w-4' /> {typeof (listing.apartment as any).area === 'object' ? (listing.apartment as any).area.parsedValue : (listing.apartment as any).area} m²
              </span>
            </div>
            <div className='font-semibold'>
              {listing.apartment.saleType === 'rent'
                ? `$${Number(listing.price).toLocaleString()}/mo`
                : `$${Number(listing.price).toLocaleString()}`}
            </div>
          </div>
          {listing.tags && (
            <div className='flex flex-wrap gap-2 pt-1'>
              {(listing.tags as any[]).map((t: any) => {
                const key = typeof t === 'string' ? t : t?.id ?? t?.tag ?? JSON.stringify(t);
                const label = typeof t === 'string' ? t : t?.tag ?? '';
                return (
                  <Badge key={key} variant='secondary'>
                    {label}
                  </Badge>
                );
              })}
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
}
