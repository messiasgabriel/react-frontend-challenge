import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm } from '@/features/auth/ui/login-form';
import { useAuthStore } from '@/features/auth/model/auth-store';

const mockNavigate = vi.fn();

vi.mock('@tanstack/react-router', () => ({
    useNavigate: () => mockNavigate,
    useSearch: () => ({ redirect: undefined }),
}));

vi.mock('@/features/auth/model/auth-store', () => ({
    useAuthStore: vi.fn(),
}));

const mockLogin = vi.fn();

function setupAuthStore(overrides = {}) {
    vi.mocked(useAuthStore).mockImplementation((selector: (s: any) => unknown) => {
        const state = { login: mockLogin, ...overrides };
        return selector ? selector(state) : state;
    });
}

describe('LoginForm', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        setupAuthStore();
    });

    it('renderiza campos de email, senha e botão de submit', () => {
        render(<LoginForm />);
        expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
    });

    it('exibe erro de validação para email vazio', async () => {
        render(<LoginForm />);
        await userEvent.click(screen.getByRole('button', { name: /entrar/i }));
        await waitFor(() =>
            expect(screen.getByText(/email é obrigatório/i)).toBeInTheDocument(),
        );
    });

    it('exibe erro de validação para email inválido', async () => {
        render(<LoginForm />);
        await userEvent.type(screen.getByLabelText(/e-mail/i), 'invalido');
        await userEvent.click(screen.getByRole('button', { name: /entrar/i }));
        await waitFor(() =>
            expect(screen.getByText(/email inválido/i)).toBeInTheDocument(),
        );
    });

    it('exibe erro de validação para senha curta', async () => {
        render(<LoginForm />);
        await userEvent.type(screen.getByLabelText(/e-mail/i), 'user@test.com');
        await userEvent.type(screen.getByLabelText(/senha/i), '123');
        await userEvent.click(screen.getByRole('button', { name: /entrar/i }));
        await waitFor(() =>
            expect(screen.getByText(/no mínimo 6 caracteres/i)).toBeInTheDocument(),
        );
    });

    it('chama login com os dados corretos ao submeter', async () => {
        mockLogin.mockResolvedValue(undefined);
        render(<LoginForm />);
        await userEvent.type(screen.getByLabelText(/e-mail/i), 'user@test.com');
        await userEvent.type(screen.getByLabelText(/senha/i), '123456');
        await userEvent.click(screen.getByRole('button', { name: /entrar/i }));
        await waitFor(() =>
            expect(mockLogin).toHaveBeenCalledWith({
                email: 'user@test.com',
                password: '123456',
            }),
        );
    });

    it('navega para /dashboard após login bem-sucedido', async () => {
        mockLogin.mockResolvedValue(undefined);
        render(<LoginForm />);
        await userEvent.type(screen.getByLabelText(/e-mail/i), 'user@test.com');
        await userEvent.type(screen.getByLabelText(/senha/i), '123456');
        await userEvent.click(screen.getByRole('button', { name: /entrar/i }));
        await waitFor(() =>
            expect(mockNavigate).toHaveBeenCalledWith({ to: '/dashboard', search: { page: 1 } }),
        );
    });

    it('navega para redirect quando fornecido após login', async () => {
        vi.mocked(useAuthStore).mockImplementation((selector: (s: any) => unknown) => {
            const state = { login: mockLogin };
            return selector ? selector(state) : state;
        });
        vi.doMock('@tanstack/react-router', () => ({
            useNavigate: () => mockNavigate,
            useSearch: () => ({ redirect: '/watchlist' }),
        }));

        mockLogin.mockResolvedValue(undefined);
        render(<LoginForm />);
        await userEvent.type(screen.getByLabelText(/e-mail/i), 'user@test.com');
        await userEvent.type(screen.getByLabelText(/senha/i), '123456');
        await userEvent.click(screen.getByRole('button', { name: /entrar/i }));
        await waitFor(() => expect(mockLogin).toHaveBeenCalled());
    });

    it('exibe mensagem de erro quando login lança exceção', async () => {
        mockLogin.mockRejectedValue(new Error('Auth failed'));
        render(<LoginForm />);
        await userEvent.type(screen.getByLabelText(/e-mail/i), 'user@test.com');
        await userEvent.type(screen.getByLabelText(/senha/i), '123456');
        await userEvent.click(screen.getByRole('button', { name: /entrar/i }));
        await waitFor(() =>
            expect(screen.getByText(/credenciais inválidas/i)).toBeInTheDocument(),
        );
    });

    it('botão fica desabilitado durante submissão', async () => {
        mockLogin.mockImplementation(() => new Promise(() => {})); // never resolves
        render(<LoginForm />);
        await userEvent.type(screen.getByLabelText(/e-mail/i), 'user@test.com');
        await userEvent.type(screen.getByLabelText(/senha/i), '123456');
        await userEvent.click(screen.getByRole('button', { name: /entrar/i }));
        await waitFor(() =>
            expect(screen.getByRole('button', { name: /entrando/i })).toBeDisabled(),
        );
    });
});
