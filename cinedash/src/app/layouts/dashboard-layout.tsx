import { Outlet } from '@tanstack/react-router';
import { AppHeader } from './app-header';

export function DashboardLayout() {
    return (
        <div className="flex min-h-screen flex-col">
            <AppHeader />
            <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6">
                <Outlet />
            </main>
        </div>
    );
}
