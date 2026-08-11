// Stores
import { useSessionStore } from '@/app/store/session.store';

// Vite
import { afterEach, describe, expect, it } from 'vitest';

describe('useSessionStore', () => {
  afterEach(() => {
    useSessionStore.getState().clearSession();
  });

  it('starts unauthenticated', () => {
    expect(useSessionStore.getState().isAuthenticated).toBe(false);
    expect(useSessionStore.getState().accessToken).toBeNull();
  });

  it('becomes authenticated after setSession', () => {
    useSessionStore.getState().setSession('token-123');

    expect(useSessionStore.getState().isAuthenticated).toBe(true);
    expect(useSessionStore.getState().accessToken).toBe('token-123');
  });

  it('clears back to unauthenticated on clearSession', () => {
    useSessionStore.getState().setSession('token-123');
    useSessionStore.getState().clearSession();

    expect(useSessionStore.getState().isAuthenticated).toBe(false);
    expect(useSessionStore.getState().accessToken).toBeNull();
  });
});
