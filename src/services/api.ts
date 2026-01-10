
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface Message {
  id: string;
  content: string;
  user: string;
  userId: string;
  spaceId: string;
  spaceName: string;
  timestamp: string;
  messageType: string;
  isEdited: boolean;
  isDeleted: boolean;
}

export interface ApiResponse<T> {
  data: T;
  error?: string;
}

export const api = {
  async getMessages(spaceId: string = 'general'): Promise<ApiResponse<{ messages: Message[] }>> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/messages?space=${spaceId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return { data };
    } catch (error) {
      return { data: { messages: [] }, error: (error as Error).message };
    }
  },

  async sendMessage(content: string, spaceId: string = 'general'): Promise<ApiResponse<Message>> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ content, spaceId }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return { data };
    } catch (error) {
      return { data: { id: '', content: '', user: '', userId: '', spaceId: '', spaceName: '', timestamp: '', messageType: '', isEdited: false, isDeleted: false }, error: (error as Error).message };
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
  
  async getSpaces(): Promise<ApiResponse<{ spaces: Space[] }>> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/spaces`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return { data };
    } catch (error) {
      return { data: { spaces: [] }, error: (error as Error).message };
    }
  },
  
  async createSpace(name: string, description?: string, type?: string): Promise<ApiResponse<Space>> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/spaces`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ name, description, type }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return { data };
    } catch (error) {
      return { data: { id: '', name: '', description: '', type: '', members: [], isArchived: false, lastActivity: '', createdAt: '', updatedAt: '' }, error: (error as Error).message };
    }
  },
};

export interface Space {
  id: string;
  name: string;
  description: string;
  type: string;
  members: {
    id: string;
    username: string;
    email: string;
    role: string;
  }[];
  isArchived: boolean;
  lastActivity: string;
  createdAt: string;
  updatedAt: string;
}
