import { Button } from '../ui/button';
import { Link } from 'react-router-dom';

const AddListingButton = () => {
  return (
    <Button
      asChild
      className='rounded-full'>
      <Link to='/listings/new'>+ Add Listing</Link>
    </Button>
  );
};

export default AddListingButton;
