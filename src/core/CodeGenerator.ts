import { GeneratedCode, GeneratorConfig } from '../types';
import { AIProvider } from '../integrations/AIProvider';
import { AIProviderFactory } from '../integrations/AIProviderFactory';

/**
 * Code generator using AI providers (abstracted)
 */
export class CodeGenerator {
  private aiProvider: AIProvider;

  constructor(aiProviderOrToken?: AIProvider | string, apiUrl?: string) {
    if (!aiProviderOrToken) {
      // Try to create from environment variables
      this.aiProvider = AIProviderFactory.createFromEnv(apiUrl);
    } else if (typeof aiProviderOrToken === 'string') {
      // Legacy support: if string provided, try to create from env or use as Cursor token
      const providerType = (process.env.PROMPT_AI_TYPE || 'CURSOR').toUpperCase();
      this.aiProvider = AIProviderFactory.create(providerType as any, aiProviderOrToken, apiUrl);
    } else {
      // AIProvider instance provided
      this.aiProvider = aiProviderOrToken;
    }
  }

  /**
   * Generate code from a prompt
   */
  async generate(prompt: string, config?: GeneratorConfig): Promise<GeneratedCode> {
    try {
      const code = await this.aiProvider.generateCode(prompt, config);

      return {
        code,
        language: config?.language || 'typescript',
        filePath: this.suggestFilePath(prompt, config),
      };
    } catch (error) {
      throw new Error(
        `Failed to generate code: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Suggest a file path based on prompt and config
   */
  private suggestFilePath(prompt: string, config?: GeneratorConfig): string | undefined {
    // Simple implementation - can be enhanced with more intelligent path suggestion
    if (config?.framework === 'react' || prompt.toLowerCase().includes('component')) {
      return 'src/components/GeneratedComponent.tsx';
    }
    if (prompt.toLowerCase().includes('api') || prompt.toLowerCase().includes('route')) {
      return 'src/api/routes.ts';
    }
    return 'src/generated.ts';
  }
}
