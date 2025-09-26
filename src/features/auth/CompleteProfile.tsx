import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { setDraft, updateDraft, clearDraft } from './profileDraftSlice';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const CompleteProfile: React.FC = () => {
  const dispatch = useAppDispatch();
  const draft = useAppSelector((s: any) => s.profileDraft);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // try to fetch server-side pending info (cookie pending_id will be sent automatically)
    axios
      .get('http://localhost:8000/api/v1/auth/oauth-pending', { withCredentials: true })
      .then((res) => {
        const data = res.data;
        const prefill = {
          firstName: data.givenName || data.firstName || draft.firstName,
          lastName: data.familyName || data.lastName || draft.lastName,
          phoneNumber: data.phoneNumber || draft.phoneNumber,
          avatarUrl: data.avatarUrl || draft.avatarUrl,
        };
        dispatch(setDraft(prefill));
      })
      .catch((err) => {
        // no pending or expired — keep local draft
        console.warn('no pending or failed', err);
      });
  }, []);

  const onChange = (k: string, v: string) => {
    dispatch(updateDraft({ [k]: v }));
  };

  const submit = async () => {
    setLoading(true);
    try {
      const payload = {
        first_name: draft.firstName,
        last_name: draft.lastName,
        phone_number: draft.phoneNumber,
        avatar_url: draft.avatarUrl,
      };
      // send finalize request — cookie pending_id sent by browser automatically
      await axios.post('http://localhost:8000/api/v1/auth/complete-profile', payload, {
        withCredentials: true,
      });
      dispatch(clearDraft());
      // redirect to home — the server set access + refresh cookies
      navigate('/');
      // optionally dispatch userLoggedIn by calling /profile endpoint to get user
    } catch (err) {
      console.error(err);
      alert('Failed to complete profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='max-w-md mx-auto p-6'>
      <h2 className='text-2xl mb-4'>Finish creating your account</h2>
      <label>
        First name
        <input
          value={draft.firstName}
          onChange={(e) => onChange('firstName', e.target.value)}
        />
      </label>
      <label>
        Last name
        <input
          value={draft.lastName}
          onChange={(e) => onChange('lastName', e.target.value)}
        />
      </label>
      <label>
        Phone number
        <input
          value={draft.phoneNumber}
          onChange={(e) => onChange('phoneNumber', e.target.value)}
        />
      </label>
      <label>
        Avatar URL
        <input
          value={draft.avatarUrl || ''}
          onChange={(e) => onChange('avatarUrl', e.target.value)}
        />
      </label>
      <button
        disabled={loading}
        onClick={submit}>
        Finish
      </button>
    </div>
  );
};
