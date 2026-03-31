import { Button } from '@/shared/ui/button';
import { useThemeStore } from '../model/theme-store';
import { Moon, Sun } from 'lucide-react';
export function ThemeToggle() {
    const { theme, toggleTheme } = useThemeStore();

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="relative"
            aria-label={
                theme === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro'
            }
        >
            <Sun
                className={`size-4 transition-all duration-300 ${theme === 'dark' ? 'rotate-0 scale-100' : 'rotate-90 scale-0'}`}
            />
            <Moon
                className={`absolute size-4 transition-all duration-300 ${theme === 'dark' ? '-rotate-90 scale-0' : 'rotate-0 scale-100'}`}
            />
        </Button>
    );
}
