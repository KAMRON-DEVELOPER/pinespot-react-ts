import axios from 'axios';

export async function fetchUser(id: number) {
  const res = await axios.get(`/users/${id}`);
  return res.data;
}
