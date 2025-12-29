/**
 * 인증 상태 관리 스토어
 * Zustand + persist를 사용하여 로컬 스토리지에 상태 저장
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CustomerMoveLoginData } from '../types';

/**
 * 이사예약 사용자 정보 (API 응답 + 추가 정보)
 */
export interface MoveAuthUser extends CustomerMoveLoginData {
  moveUuid: string;
  projectUuid?: string;
}

interface AuthState {
  user: MoveAuthUser | null;
  isAuthenticated: boolean;
  moveUuid: string | null;
  projectUuid: string | null;
  setMoveUuid: (uuid: string) => void;
  setProjectUuid: (uuid: string) => void;
  login: (user: MoveAuthUser) => void;
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
      moveUuid: null,
      projectUuid: null,

      /**
       * 이사예약 UUID 설정
       */
      setMoveUuid: (uuid: string) => {
        set({ moveUuid: uuid });
      },

      /**
       * 프로젝트 UUID 설정
       */
      setProjectUuid: (uuid: string) => {
        set({ projectUuid: uuid });
      },

      /**
       * 로그인 처리
       * @param user - 사용자 정보 (API 응답)
       */
      login: (user: MoveAuthUser) => {
        set({
          user,
          isAuthenticated: true,
          moveUuid: user.moveUuid,
          projectUuid: user.projectUuid || null,
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
      name: 'move-auth-storage',
    }
  )
);
