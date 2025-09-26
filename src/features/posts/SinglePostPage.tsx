import { Link, useParams } from 'react-router-dom';

import { useAppSelector } from '@/app/hooks';
import { selectPostById } from './postsSlice';
import { selectCurrentUsername } from '../auth/authSlice';
import { ReactionButtons } from './ReactionButtons';

export const SinglePostPage = () => {
  const { postId } = useParams();

  // const post = useAppSelector((state) => state.posts.find((post) => post.id === postId));
  const post = useAppSelector((state) => selectPostById(state, postId!))!;
  const currentUsername = useAppSelector(selectCurrentUsername)!;
  const canEdit = currentUsername === post.user;

  if (!post) {
    return (
      <section>
        <h2>Post not found!</h2>
      </section>
    );
  }

  return (
    <section>
      <article className='post'>
        <h2>{post.title}</h2>
        <p className='post-content'>{post.content}</p>
        <ReactionButtons post={post} />
        {canEdit && (
          <Link
            to={`/editPost/${post.id}`}
            className='button'>
            Edit Post
          </Link>
        )}
      </article>
    </section>
  );
};
