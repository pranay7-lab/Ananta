import { User } from '../types';

const USERS_KEY = 'ananta_users';

interface UserRecord extends User {
  passwordHash: string; // In a real app, use proper hashing. For frontend-only, we store simple strings or base64.
}

export const authService = {
  getUsers(): UserRecord[] {
    const usersJson = localStorage.getItem(USERS_KEY);
    return usersJson ? JSON.parse(usersJson) : [];
  },

  register(username: string, password: string): { success: boolean; message?: string; user?: User } {
    const users = this.getUsers();
    
    if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
      return { success: false, message: 'Username already exists' };
    }

    const newUser: UserRecord = {
      id: Date.now().toString(),
      username,
      passwordHash: btoa(password) // Simple encoding for demo purposes
    };

    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    return { success: true, user: { id: newUser.id, username: newUser.username } };
  },

  login(username: string, password: string): { success: boolean; message?: string; user?: User } {
    const users = this.getUsers();
    const user = users.find(u => 
      u.username.toLowerCase() === username.toLowerCase() && 
      u.passwordHash === btoa(password)
    );

    if (!user) {
      return { success: false, message: 'Invalid username or password' };
    }

    return { success: true, user: { id: user.id, username: user.username } };
  }
};