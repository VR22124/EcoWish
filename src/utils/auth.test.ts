import { describe, it, expect, beforeEach } from 'vitest';
import { getAnonymousUserId } from './auth';

describe('auth', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('generates and stores a new UUID if none exists', () => {
    const id = getAnonymousUserId();
    expect(id).toBeDefined();
    expect(localStorage.getItem('ecowish_user_id')).toBe(id);
  });

  it('returns existing UUID if one exists in localStorage', () => {
    localStorage.setItem('ecowish_user_id', 'existing-uuid');
    const id = getAnonymousUserId();
    expect(id).toBe('existing-uuid');
  });
});
