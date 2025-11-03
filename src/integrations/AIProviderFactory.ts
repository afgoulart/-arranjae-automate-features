import { AIProvider, AIProviderType } from './AIProvider';
import { CursorProvider } from './providers/CursorProvider';
import { ClaudeCodeProvider } from './providers/ClaudeCodeProvider';

/**
 * Factory for creating AI providers
 */
export class AIProviderFactory {
  /**
   * Create an AI provider based on type
   * @param type - AI provider type (CURSOR, CLAUDE_CODE)
   * @param apiKey - API key/token for the provider
   * @param apiUrl - Optional API URL (overrides env vars and defaults)
   */
  static create(type: AIProviderType, apiKey: string, apiUrl?: string): AIProvider {
    switch (type) {
      case 'CURSOR':
        return new CursorProvider(apiKey, apiUrl);

      case 'CLAUDE_CODE':
        return new ClaudeCodeProvider(apiKey, apiUrl);

      default:
        throw new Error(`Unsupported AI provider type: ${type}`);
    }
  }

  /**
   * Create an AI provider from environment variables
   */
  static createFromEnv(apiUrl?: string): AIProvider {
    const providerType = (process.env.PROMPT_AI_TYPE || 'CURSOR').toUpperCase() as AIProviderType;
    // PROMPT_AI_KEY é a variável única que funciona para qualquer tipo de AI
    const apiKey = process.env.PROMPT_AI_KEY || process.env.CURSOR_API_TOKEN || '';

    if (!apiKey) {
      throw new Error(
        'PROMPT_AI_KEY environment variable is required. ' +
          'Set PROMPT_AI_TYPE to CURSOR or CLAUDE_CODE and provide PROMPT_AI_KEY with the API key/token.'
      );
    }

    return this.create(providerType, apiKey, apiUrl);
  }

  /**
   * Get available provider types
   */
  static getAvailableTypes(): AIProviderType[] {
    return ['CURSOR', 'CLAUDE_CODE'];
  }
}
