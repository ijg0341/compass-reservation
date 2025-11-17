/**
 * 인증 상태 관리 스토어
 * Zustand + persist를 사용하여 로컬 스토리지에 상태 저장
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { MoveUser } from '../types/move';

interface AuthState {
  user: MoveUser | null;
  isAuthenticated: boolean;
  login: (user: MoveUser) => void;
  logout: () => void;
}

/**
 * 인증 스토어
 * @returns AuthState
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      /**
       * 로그인 처리
       * @param user - 사용자 정보
       */
      login: (user: MoveUser) => {
        set({
          user,
          isAuthenticated: true,
        });
      },

      /**
       * 로그아웃 처리
       */
      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
