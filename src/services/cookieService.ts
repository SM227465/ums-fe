import { useCookies } from 'react-cookie';
import { COOKIE_CONFIG } from '../config/api';

class CookieService {
  setToken(token: string) {
    const expirationDate = new Date();
    expirationDate.setTime(expirationDate.getTime() + COOKIE_CONFIG.OPTIONS.maxAge * 1000);

    document.cookie = `${
      COOKIE_CONFIG.TOKEN_NAME
    }=${token}; expires=${expirationDate.toUTCString()}; path=${COOKIE_CONFIG.OPTIONS.path}; ${
      COOKIE_CONFIG.OPTIONS.secure ? 'secure;' : ''
    } samesite=${COOKIE_CONFIG.OPTIONS.sameSite}`;
  }

  getToken(): string | null {
    if (typeof document !== 'undefined') {
      const cookies = document.cookie
        .split(';')
        .find((row) => row.trim().startsWith(`${COOKIE_CONFIG.TOKEN_NAME}=`));
      return cookies ? cookies.split('=')[1] : null;
    }
    return null;
  }

  setRefreshToken(refreshToken: string) {
    const expirationDate = new Date();
    expirationDate.setTime(expirationDate.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days

    document.cookie = `${
      COOKIE_CONFIG.REFRESH_TOKEN_NAME
    }=${refreshToken}; expires=${expirationDate.toUTCString()}; path=${
      COOKIE_CONFIG.OPTIONS.path
    }; ${COOKIE_CONFIG.OPTIONS.secure ? 'secure;' : ''} samesite=${COOKIE_CONFIG.OPTIONS.sameSite}`;
  }

  getRefreshToken(): string | null {
    if (typeof document !== 'undefined') {
      const cookies = document.cookie
        .split(';')
        .find((row) => row.trim().startsWith(`${COOKIE_CONFIG.REFRESH_TOKEN_NAME}=`));
      return cookies ? cookies.split('=')[1] : null;
    }
    return null;
  }

  clearTokens() {
    if (typeof document !== 'undefined') {
      document.cookie = `${COOKIE_CONFIG.TOKEN_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${COOKIE_CONFIG.OPTIONS.path};`;
      document.cookie = `${COOKIE_CONFIG.REFRESH_TOKEN_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${COOKIE_CONFIG.OPTIONS.path};`;
    }
  }
}

export const cookieService = new CookieService();

// Hook for cookie operations (to be used in React components)
export const useCookieService = () => {
  const [cookies, setCookie, removeCookie] = useCookies([
    COOKIE_CONFIG.TOKEN_NAME,
    COOKIE_CONFIG.REFRESH_TOKEN_NAME,
  ]);

  const setToken = (token: string, expirationDate?: Date) => {
    const options = {
      ...COOKIE_CONFIG.OPTIONS,
      ...(expirationDate && { expires: expirationDate }),
    };
    setCookie(COOKIE_CONFIG.TOKEN_NAME, token, options);
  };

  const setRefreshToken = (refreshToken: string, expirationDate?: Date) => {
    const options = {
      ...COOKIE_CONFIG.OPTIONS,
      ...(expirationDate && { expires: expirationDate }),
      maxAge: 30 * 24 * 60 * 60, // 30 days
    };
    setCookie(COOKIE_CONFIG.REFRESH_TOKEN_NAME, refreshToken, options);
  };

  const clearTokens = () => {
    removeCookie(COOKIE_CONFIG.TOKEN_NAME, { path: '/' });
    removeCookie(COOKIE_CONFIG.REFRESH_TOKEN_NAME, { path: '/' });
  };

  return {
    token: cookies[COOKIE_CONFIG.TOKEN_NAME],
    refreshToken: cookies[COOKIE_CONFIG.REFRESH_TOKEN_NAME],
    setToken,
    setRefreshToken,
    clearTokens,
  };
};
