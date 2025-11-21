import { describe, it, expect } from 'vitest';
import { scoreObjective } from '../src/utils/scoring.js';
describe('scoreObjective', () => {
    it('awards full marks for correct answer', () => {
        const s = scoreObjective({ id: 1, type: 'MCQ', marks: 2, answerKey: 'B' }, 'B');
        expect(s).toBe(2);
    });
    it('applies negative marks for wrong answer', () => {
        const s = scoreObjective({ id: 1, type: 'MCQ', marks: 2, negativeMarks: 1, answerKey: 'B' }, 'A');
        expect(s).toBe(-1);
    });
    it('awards zero for no response', () => {
        const s = scoreObjective({ id: 1, type: 'TF', marks: 1, answerKey: 'T' }, '');
        expect(s).toBe(0);
    });
});
