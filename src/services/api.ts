const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const apiCache = new Map();
const CACHE_TIMEOUT = 5 * 60 * 1000; // 5 minutes

const cleanupCache = () => {
  const now = Date.now();
  for (const [key, value] of apiCache.entries()) {
    if (now - value.timestamp > CACHE_TIMEOUT) {
      apiCache.delete(key);
    }
  }
};

setInterval(cleanupCache, 60 * 1000);

export interface Message {
  id: string;
  content: string;
  user: string;
  userId: string;
  userRole?: string;
  spaceId: string; 
  spaceName: string;
  timestamp: string;
  messageType: string;
  isEdited: boolean;
  isDeleted: boolean;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  isActive: boolean;
  lastSeen: string;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  type: 'message' | 'mention' | 'direct_message' | 'system' | 'reaction';
  title: string;
  message: string;
  isRead: boolean;
  spaceId?: string;
  conversationId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  data: T;
  error?: string;
}

export const api = {
  async getMessages(spaceId: string = 'general'): Promise<ApiResponse<{ messages: Message[] }>> {
    try {
      const cacheKey = `messages_${spaceId}`;
      const cached = apiCache.get(cacheKey);
      
      if (cached && Date.now() - cached.timestamp < CACHE_TIMEOUT) {
        return { data: cached.data };
      }
      
      const response = await fetch(`${API_BASE_URL}/api/messages?space=${spaceId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      apiCache.set(cacheKey, {
        data,
        timestamp: Date.now()
      });
      
      return { data };
    } catch (error) {
      return { data: { messages: [] }, error: (error as Error).message };
    }
  },

  async sendMessage(content: string, spaceId: string = 'general'): Promise<ApiResponse<Message>> {
    apiCache.delete(`messages_${spaceId}`);
    
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

  async sendDirectMessage(content: string, recipientId: string): Promise<ApiResponse<Message>> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/direct-messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ content, recipientId }),
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

  async getDirectMessageConversations(): Promise<ApiResponse<{ conversations: DirectMessageConversation[] }>> {
    try {
      const cacheKey = 'direct_conversations';
      const cached = apiCache.get(cacheKey);
      
      if (cached && Date.now() - cached.timestamp < CACHE_TIMEOUT) {
        return { data: cached.data };
      }
      
      const response = await fetch(`${API_BASE_URL}/api/direct-messages/conversations`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      apiCache.set(cacheKey, {
        data,
        timestamp: Date.now()
      });
      
      return { data };
    } catch (error) {
      return { data: { conversations: [] }, error: (error as Error).message };
    }
  },

  async getDirectMessages(conversationId: string): Promise<ApiResponse<{ messages: Message[] }>> {
    try {
      const cacheKey = `direct_messages_${conversationId}`;
      const cached = apiCache.get(cacheKey);
      
      if (cached && Date.now() - cached.timestamp < CACHE_TIMEOUT) {
        return { data: cached.data };
      }
      
      const response = await fetch(`${API_BASE_URL}/api/direct-messages/${conversationId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      apiCache.set(cacheKey, {
        data,
        timestamp: Date.now()
      });
      
      return { data };
    } catch (error) {
      return { data: { messages: [] }, error: (error as Error).message };
    }
  },

  async getNotifications(isRead?: boolean): Promise<ApiResponse<{ 
    notifications: Notification[]; 
    pagination: { 
      total: number; 
      page: number; 
      pages: number; 
      limit: number 
    } 
  }>> {
    try {
      let url = `${API_BASE_URL}/api/notifications`;
      if (isRead !== undefined) {
        url += `?isRead=${isRead}`;
      }
      const response = await fetch(url, {
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
      return { 
        data: { 
          notifications: [], 
          pagination: { total: 0, page: 1, pages: 1, limit: 50 } 
        }, 
        error: (error as Error).message 
      };
    }
  },

  async markNotificationAsRead(notificationId: string): Promise<ApiResponse<Notification>> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return { data };
    } catch (error) {
      return { 
        data: { 
          id: '', 
          type: 'message', 
          title: '', 
          message: '', 
          isRead: false, 
          createdAt: '', 
          updatedAt: '' 
        }, 
        error: (error as Error).message 
      };
    }
  },

  async markAllNotificationsAsRead(): Promise<ApiResponse<{ message: string }>> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/notifications/mark-all-read`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return { data };
    } catch (error) {
      return { 
        data: { message: '' }, 
        error: (error as Error).message 
      };
    }
  },

  async deleteNotification(notificationId: string): Promise<ApiResponse<{ message: string }>> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/notifications/${notificationId}`, {
        method: 'DELETE',
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
      return { 
        data: { message: '' }, 
        error: (error as Error).message 
      };
    }
  },

  async deleteAllNotifications(): Promise<ApiResponse<{ message: string }>> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/notifications`, {
        method: 'DELETE',
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
      return { 
        data: { message: '' }, 
        error: (error as Error).message 
      };
    }
  },

  async joinSpace(spaceId: string): Promise<ApiResponse<{ message: string; spaceId: string }>> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/spaces/${spaceId}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return { data };
    } catch (error) {
      return { 
        data: { message: '', spaceId: '' }, 
        error: (error as Error).message 
      };
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
      const cacheKey = 'spaces';
      const cached = apiCache.get(cacheKey);
      
      if (cached && Date.now() - cached.timestamp < CACHE_TIMEOUT) {
        return { data: cached.data };
      }
      
      const response = await fetch(`${API_BASE_URL}/api/spaces`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      apiCache.set(cacheKey, {
        data,
        timestamp: Date.now()
      });
      
      return { data };
    } catch (error) {
      return { data: { spaces: [] }, error: (error as Error).message };
    }
  },
  
  async createSpace(name: string, description?: string, type?: string): Promise<ApiResponse<Space>> {
    apiCache.delete('spaces');
    
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

  async getUsers(): Promise<ApiResponse<{ users: User[] }>> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/users`, {
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
      return { data: { users: [] }, error: (error as Error).message };
    }
  },

  async createUser(username: string, email: string, password: string): Promise<ApiResponse<User>> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ username, email, password }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return { data: data.user }; 
    } catch (error) {
      return { 
        data: { 
          id: '', 
          username: '', 
          email: '', 
          role: 'user', 
          isActive: false, 
          lastSeen: '', 
          createdAt: '', 
          updatedAt: '' 
        }, 
        error: (error as Error).message 
      };
    }
  },

  async getAdminMessages(spaceId?: string): Promise<ApiResponse<{ messages: Message[], totalCount: number }>> {
    try {
      let url = `${API_BASE_URL}/api/admin/messages`;
      if (spaceId) {
        url += `?spaceId=${spaceId}`;
      }
      const response = await fetch(url, {
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
      return { data: { messages: [], totalCount: 0 }, error: (error as Error).message };
    }
  },

  async getAdminSpaces(): Promise<ApiResponse<{ spaces: AdminSpace[] }>> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/spaces`, {
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

  async searchUsers(query: string, limit: number = 10): Promise<ApiResponse<{ users: User[] }>> {
    try {
      const encodedQuery = encodeURIComponent(query);
      const response = await fetch(`${API_BASE_URL}/api/users/search?q=${encodedQuery}&limit=${limit}`, {
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
      return { data: { users: [] }, error: (error as Error).message };
    }
  }
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

export interface AdminSpace {
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
  admins: string[];
  isArchived: boolean;
  lastActivity: string;
  createdAt: string;
  updatedAt: string;
}

export interface DirectMessageConversation {
  id: string;
  spaceName: string;
  type: string;
  participants: {
    id: string;
    username: string;
    email: string;
    role: string;
    avatar: string;
  }[];
  otherUser: {
    id: string;
    username: string;
    email: string;
    role: string;
    avatar: string;
  } | null;
  lastActivity: string;
}




