import { describe, it, expect } from 'vitest';
import { z } from 'zod';

const searchSchema = z.object({
    page: z.number().int().positive().catch(1),
});

describe('searchSchema (validateSearch do dashboard)', () => {
    it('deve aceitar page válido', () => {
        expect(searchSchema.parse({ page: 3 })).toEqual({ page: 3 });
    });

    it('page negativo deve cair no catch e retornar 1', () => {
        expect(searchSchema.parse({ page: -1 })).toEqual({ page: 1 });
    });

    it('page zero deve cair no catch e retornar 1', () => {
        expect(searchSchema.parse({ page: 0 })).toEqual({ page: 1 });
    });

    it('page como string deve cair no catch e retornar 1', () => {
        expect(searchSchema.parse({ page: 'abc' })).toEqual({ page: 1 });
    });

    it('page ausente deve cair no catch e retornar 1', () => {
        expect(searchSchema.parse({})).toEqual({ page: 1 });
    });

    it('page decimal deve cair no catch e retornar 1', () => {
        expect(searchSchema.parse({ page: 1.5 })).toEqual({ page: 1 });
    });
});
