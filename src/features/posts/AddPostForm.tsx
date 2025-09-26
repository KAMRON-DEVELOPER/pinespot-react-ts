import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { postAdded } from './postsSlice';
import { selectAllUsers } from '../users/usersSlice';
import { selectCurrentUsername } from '../auth/authSlice';

interface AddPostFormFields extends HTMLFormControlsCollection {
  postTitle: HTMLInputElement;
  postContent: HTMLTextAreaElement;
}
interface AddPostFormElements extends HTMLFormElement {
  readonly elements: AddPostFormFields;
}

function AddPostForm() {
  // Get the `dispatch` method from the store
  const dispatch = useAppDispatch();
  const userId = useAppSelector(selectCurrentUsername)!;
  const users = useAppSelector(selectAllUsers);

  const handleSubmit = (e: React.FormEvent<AddPostFormElements>) => {
    e.preventDefault();

    const { elements } = e.currentTarget;
    const title = elements.postTitle.value;
    const content = elements.postContent.value;

    console.log('Values: ', { title, content });

    dispatch(postAdded(title, content, userId));

    e.currentTarget.reset();
  };

  const usersOptions = users.map((user) => (
    <option
      key={user.id}
      value={user.id}>
      {user.name}
    </option>
  ));

  return (
    <section>
      <h2>Add a New Post</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor='postTitle'>Post Title:</label>
        <input
          type='text'
          id='postTitle'
          defaultValue=''
          required
        />
        <label htmlFor='postContent'>Content:</label>
        <textarea
          id='postContent'
          name='postContent'
          defaultValue=''
          required
        />
        <button>Save Post</button>
      </form>
    </section>
  );
}

export default AddPostForm;
