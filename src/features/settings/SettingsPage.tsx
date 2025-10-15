export default function SettingsPage() {
  return (
    <div className='min-h-screen bg-background text-foreground'>
      <header className='p-4 border-b'>
        <h1 className='text-xl font-semibold'>Settings</h1>
      </header>
      <main className='max-w-3xl mx-auto p-4 space-y-6'>
        <section className='border rounded-lg p-4 bg-card'>
          <h2 className='font-medium mb-2'>Appearance</h2>
          <p className='text-sm text-muted-foreground'>Use the theme switcher in the navbar to toggle light/dark/system.</p>
        </section>
        <section className='border rounded-lg p-4 bg-card'>
          <h2 className='font-medium mb-2'>Account</h2>
          <p className='text-sm text-muted-foreground'>Account settings will appear here.</p>
        </section>
      </main>
    </div>
  );
}
