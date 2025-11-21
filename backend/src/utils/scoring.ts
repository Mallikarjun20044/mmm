export type ObjectiveQuestion = {
  id: number;
  type: 'MCQ' | 'TF';
  marks: number;
  negativeMarks?: number;
  answerKey: string; // canonical answer
};

export function scoreObjective(q: ObjectiveQuestion, response: string | null | undefined) {
  const neg = q.negativeMarks ?? 0;
  if (!response || response.trim() === '') return 0;
  return response === q.answerKey ? q.marks : -neg;
}
