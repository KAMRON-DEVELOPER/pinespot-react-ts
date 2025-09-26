import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { decrement, increment, incrementAsync, incrementByAmount, incrementIfOdd, selectCount, selectStatus } from './counterSlice';

function Counter() {
  const dispatch = useAppDispatch();
  const count = useAppSelector(selectCount);
  const status = useAppSelector(selectStatus);
  const [incrementAmount, setIncrementAmount] = useState('2');

  const incrementValue = Number(incrementAmount) || 0;

  return (
    <div>
      <div>
        <button onClick={() => dispatch(decrement())}>-</button>
        <span>{count}</span>
        <button onClick={() => dispatch(increment())}>+</button>
      </div>

      <div>
        <input
          value={incrementAmount}
          onChange={(e) => setIncrementAmount(e.target.value)}
        />
        <button onClick={() => dispatch(incrementByAmount(incrementValue))}>Add Amount</button>
        <button onClick={() => dispatch(incrementAsync())}>Add Async (after 3s)</button>
        <button onClick={() => dispatch(incrementIfOdd(incrementValue))}>Add If Odd</button>
      </div>

      <p>Status: {status}</p>
    </div>
  );
}

export default Counter;
