export default function WishlistPage() {
  return (
    <div className='min-h-screen bg-background text-foreground'>
      <header className='p-4 border-b'>
        <h1 className='text-xl font-semibold'>Wishlists</h1>
      </header>
      <main className='max-w-6xl mx-auto p-4'>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
          <div className='border rounded-lg p-4 bg-card'>
            <p className='text-sm text-muted-foreground'>Your wishlist is empty.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
