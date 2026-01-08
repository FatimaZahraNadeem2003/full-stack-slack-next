
const API_BASE_URL = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5000';

export interface Message {
  id: number;
  user: string;
  text: string;
  timestamp: string;
}

export interface ApiResponse<T> {
  data: T;
  error?: string;
}

export const api = {
  async getMessages(): Promise<ApiResponse<{ messages: Message[] }>> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/messages`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return { data };
    } catch (error) {
      return { data: { messages: [] }, error: (error as Error).message };
    }
  },

  async sendMessage(user: string, text: string): Promise<ApiResponse<Message>> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user, text }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return { data };
    } catch (error) {
      return { data: { id: 0, user: '', text: '', timestamp: '' }, error: (error as Error).message };
    }
  },

  async checkHealth(): Promise<ApiResponse<{ status: string }>> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/health`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return { data };
    } catch (error) {
      return { data: { status: '' }, error: (error as Error).message };
    }
  },
};