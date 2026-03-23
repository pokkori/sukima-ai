import { TEMPLATE_PROMPTS } from '../background';

describe('template-prompts', () => {
  const expectedKeys = ['explain', 'translate', 'summarize', 'tax', 'business', 'medical', 'simple'];

  expectedKeys.forEach((key) => {
    test(`${key}: {{text}} プレースホルダーが存在する`, () => {
      const prompt = TEMPLATE_PROMPTS[key];
      expect(prompt).toBeDefined();
      expect(prompt).toContain('{{text}}');
    });
  });
});
