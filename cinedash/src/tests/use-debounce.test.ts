import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDebounce } from '@/shared/hooks/use-debounce';

describe('useDebounce', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('retorna o valor inicial imediatamente', () => {
        const { result } = renderHook(() => useDebounce('inicial', 500));
        expect(result.current).toBe('inicial');
    });

    it('não atualiza o valor antes do delay expirar', () => {
        const { result, rerender } = renderHook(({ value }) => useDebounce(value, 500), {
            initialProps: { value: 'a' },
        });

        rerender({ value: 'ab' });
        act(() => { vi.advanceTimersByTime(499); });

        expect(result.current).toBe('a');
    });

    it('atualiza o valor após o delay expirar', () => {
        const { result, rerender } = renderHook(({ value }) => useDebounce(value, 500), {
            initialProps: { value: 'a' },
        });

        rerender({ value: 'ab' });
        act(() => { vi.advanceTimersByTime(500); });

        expect(result.current).toBe('ab');
    });

    it('cancela o timer anterior quando o valor muda antes do delay', () => {
        const { result, rerender } = renderHook(({ value }) => useDebounce(value, 500), {
            initialProps: { value: 'a' },
        });

        rerender({ value: 'ab' });
        act(() => { vi.advanceTimersByTime(300); });

        rerender({ value: 'abc' });
        act(() => { vi.advanceTimersByTime(300); });

        // 300ms do segundo update — ainda não chegou a 500ms
        expect(result.current).toBe('a');

        act(() => { vi.advanceTimersByTime(200); });
        expect(result.current).toBe('abc');
    });

    it('respeita delay customizado', () => {
        const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), {
            initialProps: { value: 'x' },
        });

        rerender({ value: 'y' });
        act(() => { vi.advanceTimersByTime(300); });

        expect(result.current).toBe('y');
    });

    it('usa 500ms como delay padrão', () => {
        const { result, rerender } = renderHook(({ value }) => useDebounce(value), {
            initialProps: { value: 'x' },
        });

        rerender({ value: 'y' });
        act(() => { vi.advanceTimersByTime(499); });
        expect(result.current).toBe('x');

        act(() => { vi.advanceTimersByTime(1); });
        expect(result.current).toBe('y');
    });
});
