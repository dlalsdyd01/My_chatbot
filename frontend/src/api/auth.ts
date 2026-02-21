import client from './client';
import type { SignupRequest, TokenResponse, User } from '../types/auth';

export async function signup(data: SignupRequest): Promise<User> {
  const res = await client.post('/auth/signup', data);
  return res.data;
}

export async function login(email: string, password: string): Promise<TokenResponse> {
  const formData = new URLSearchParams();
  formData.append('username', email); // OAuth2 expects 'username' field
  formData.append('password', password);
  const res = await client.post('/auth/login', formData, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
  return res.data;
}

export async function getMe(): Promise<User> {
  const res = await client.get('/auth/me');
  return res.data;
}
