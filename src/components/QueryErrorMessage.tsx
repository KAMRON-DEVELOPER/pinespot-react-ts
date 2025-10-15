import type { SerializedError } from '@reduxjs/toolkit';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';

type QueryError = FetchBaseQueryError | SerializedError | undefined;

export const QueryErrorMessage = ({ error }: { error: QueryError }) => {
  if (!error) return null;

  if ('status' in error) {
    if (typeof error.status === 'string') {
      return (
        <>
          <p>error.error: {error.error}</p>
          <p>JSON.stringify: {JSON.stringify(error.error)}</p>
        </>
      );
    }

    // if (typeof error.data === 'object')
    // if (typeof error.data === 'function')
    if (['string', 'number', 'bigint', 'boolean', 'symbol'].includes(typeof error.data)) {
      return <p>{String(error.data)}</p>;
    }

    if (error.data === undefined) return <p>error.data is undefined</p>;
    if (error.data === null) return <p>error.data is null</p>;

    return (
      <p>
        HTTP {error.status}: {JSON.stringify(error.data)}
      </p>
    );
  }

  if (error.message === undefined) return <p>error.message is undefined</p>;

  return (
    <>
      <p>error.message: {error.message}</p>
      <p>error.message: {JSON.stringify(error.message)}</p>
    </>
  );
};
