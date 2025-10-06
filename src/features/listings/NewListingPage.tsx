import { Button } from '@/components/ui/button';

const NewListingPage = () => {
  return (
    <div className='max-w-2xl mx-auto mt-10 bg-white p-6 shadow-md rounded-lg'>
      <h1 className='text-2xl font-semibold mb-4'>Add a New Listing</h1>
      <form className='space-y-4'>
        <input
          className='w-full border rounded px-3 py-2'
          placeholder='Title'
        />
        <input
          className='w-full border rounded px-3 py-2'
          placeholder='Price'
          type='number'
        />
        <textarea
          className='w-full border rounded px-3 py-2'
          placeholder='Description'
        />
        <Button className='bg-indigo-500 hover:bg-indigo-600'>Save Listing</Button>
      </form>
    </div>
  );
};

export default NewListingPage;
