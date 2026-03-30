import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Pagination } from '@/shared/ui/pagination';

describe('Pagination', () => {
    it('renderiza botões "Primeira" e "Última"', () => {
        render(<Pagination currentPage={5} totalPages={20} onPageChange={vi.fn()} />);
        expect(screen.getByRole('button', { name: /primeira/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /última/i })).toBeInTheDocument();
    });

    it('"Primeira" está desabilitado na página 1', () => {
        render(<Pagination currentPage={1} totalPages={10} onPageChange={vi.fn()} />);
        expect(screen.getByRole('button', { name: /primeira/i })).toBeDisabled();
    });

    it('"Última" está desabilitado na última página', () => {
        render(<Pagination currentPage={10} totalPages={10} onPageChange={vi.fn()} />);
        expect(screen.getByRole('button', { name: /última/i })).toBeDisabled();
    });

    it('clicar em "Primeira" chama onPageChange com 1', async () => {
        const onPageChange = vi.fn();
        render(<Pagination currentPage={5} totalPages={20} onPageChange={onPageChange} />);
        await userEvent.click(screen.getByRole('button', { name: /primeira/i }));
        expect(onPageChange).toHaveBeenCalledWith(1);
    });

    it('clicar em "Última" chama onPageChange com totalPages', async () => {
        const onPageChange = vi.fn();
        render(<Pagination currentPage={1} totalPages={20} onPageChange={onPageChange} />);
        await userEvent.click(screen.getByRole('button', { name: /última/i }));
        expect(onPageChange).toHaveBeenCalledWith(20);
    });

    it('exibe "..." quando há páginas anteriores não mostradas', () => {
        render(<Pagination currentPage={5} totalPages={20} onPageChange={vi.fn()} />);
        const ellipses = screen.getAllByText('...');
        expect(ellipses.length).toBeGreaterThanOrEqual(1);
    });

    it('botão da página atual está desabilitado', () => {
        render(<Pagination currentPage={5} totalPages={20} onPageChange={vi.fn()} />);
        expect(screen.getByRole('button', { name: 'Página 5' })).toBeDisabled();
    });

    it('clicar em página adjacente chama onPageChange com o número correto', async () => {
        const onPageChange = vi.fn();
        render(<Pagination currentPage={5} totalPages={20} onPageChange={onPageChange} />);
        await userEvent.click(screen.getByRole('button', { name: 'Página 6' }));
        expect(onPageChange).toHaveBeenCalledWith(6);
    });
});
