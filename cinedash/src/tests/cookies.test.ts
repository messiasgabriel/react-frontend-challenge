import { describe, it, expect, beforeEach } from 'vitest';
import { setCookie, getCookie, deleteCookie } from '@/shared/lib/cookies';

describe('cookies', () => {
    beforeEach(() => {
        deleteCookie();
    });

    it('setCookie persiste o valor no document.cookie', () => {
        setCookie('meu-token', 3600);
        expect(document.cookie).toContain('cinedash_token=');
    });

    it('getCookie recupera o valor persistido', () => {
        setCookie('token-abc', 3600);
        expect(getCookie()).toBe('token-abc');
    });

    it('getCookie retorna null quando cookie não existe', () => {
        expect(getCookie()).toBeNull();
    });

    it('deleteCookie remove o cookie', () => {
        setCookie('token-abc', 3600);
        deleteCookie();
        expect(getCookie()).toBeNull();
    });

    it('setCookie faz encode de caracteres especiais', () => {
        const tokenComEspeciais = 'token com espaço & símbolo=valor';
        setCookie(tokenComEspeciais, 3600);
        expect(getCookie()).toBe(tokenComEspeciais);
    });

    it('sobrescrever cookie com novo valor retorna o mais recente', () => {
        setCookie('token-v1', 3600);
        setCookie('token-v2', 3600);
        expect(getCookie()).toBe('token-v2');
    });
});
