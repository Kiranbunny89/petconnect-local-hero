// PetConnect localStorage utilities for data persistence

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: string;
}

export interface Pet {
  id: string;
  name: string;
  breed: string;
  age: number;
  gender: 'male' | 'female';
  healthInfo: string;
  description: string;
  image: string; // base64 encoded image
  contact: string;
  ownerId: string;
  createdAt: string;
  featured?: boolean;
}

export interface Session {
  userId: string;
  isLoggedIn: boolean;
}

// Storage keys
const STORAGE_KEYS = {
  USERS: 'petconnect_users',
  PETS: 'petconnect_pets',
  SESSION: 'petconnect_session',
} as const;

// User management
export const userStorage = {
  getAll: (): User[] => {
    const users = localStorage.getItem(STORAGE_KEYS.USERS);
    return users ? JSON.parse(users) : [];
  },

  create: (userData: Omit<User, 'id' | 'createdAt'>): User => {
    const users = userStorage.getAll();
    const newUser: User = {
      ...userData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    return newUser;
  },

  findByEmail: (email: string): User | null => {
    const users = userStorage.getAll();
    return users.find(user => user.email === email) || null;
  },

  authenticate: (email: string, password: string): User | null => {
    const user = userStorage.findByEmail(email);
    return user && user.password === password ? user : null;
  },
};

// Pet management
export const petStorage = {
  getAll: (): Pet[] => {
    const pets = localStorage.getItem(STORAGE_KEYS.PETS);
    return pets ? JSON.parse(pets) : [];
  },

  create: (petData: Omit<Pet, 'id' | 'createdAt'>): Pet => {
    const pets = petStorage.getAll();
    const newPet: Pet = {
      ...petData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    pets.push(newPet);
    localStorage.setItem(STORAGE_KEYS.PETS, JSON.stringify(pets));
    return newPet;
  },

  getById: (id: string): Pet | null => {
    const pets = petStorage.getAll();
    return pets.find(pet => pet.id === id) || null;
  },

  getByOwnerId: (ownerId: string): Pet[] => {
    const pets = petStorage.getAll();
    return pets.filter(pet => pet.ownerId === ownerId);
  },

  getFeatured: (): Pet[] => {
    const pets = petStorage.getAll();
    return pets.filter(pet => pet.featured).slice(0, 4);
  },

  update: (id: string, updates: Partial<Pet>): Pet | null => {
    const pets = petStorage.getAll();
    const index = pets.findIndex(pet => pet.id === id);
    if (index === -1) return null;
    
    pets[index] = { ...pets[index], ...updates };
    localStorage.setItem(STORAGE_KEYS.PETS, JSON.stringify(pets));
    return pets[index];
  },

  delete: (id: string): boolean => {
    const pets = petStorage.getAll();
    const filtered = pets.filter(pet => pet.id !== id);
    if (filtered.length === pets.length) return false;
    
    localStorage.setItem(STORAGE_KEYS.PETS, JSON.stringify(filtered));
    return true;
  },
};

// Session management
export const sessionStorage = {
  get: (): Session | null => {
    const session = localStorage.getItem(STORAGE_KEYS.SESSION);
    return session ? JSON.parse(session) : null;
  },

  create: (userId: string): void => {
    const session: Session = { userId, isLoggedIn: true };
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
  },

  clear: (): void => {
    localStorage.removeItem(STORAGE_KEYS.SESSION);
  },

  getCurrentUser: (): User | null => {
    const session = sessionStorage.get();
    if (!session || !session.isLoggedIn) return null;
    
    const users = userStorage.getAll();
    return users.find(user => user.id === session.userId) || null;
  },
};

// Initialize sample data
export const initializeSampleData = (): void => {
  // Only initialize if no data exists
  if (userStorage.getAll().length === 0) {
    // Create sample users
    const sampleUser1 = userStorage.create({
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      password: 'password123',
    });

    const sampleUser2 = userStorage.create({
      name: 'Mike Chen',
      email: 'mike@example.com',
      password: 'password123',
    });

    // Create sample pets
    petStorage.create({
      name: 'Buddy',
      breed: 'Golden Retriever',
      age: 3,
      gender: 'male',
      healthInfo: 'Vaccinated, neutered, healthy',
      description: 'Friendly and energetic dog, great with kids and other pets. Loves to play fetch and go on walks.',
      image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9IiNGRkY4RjAiLz48Y2lyY2xlIGN4PSIxNTAiIGN5PSIxMjAiIHI9IjUwIiBmaWxsPSIjRjU5RTBCIi8+PGNpcmNsZSBjeD0iMTMwIiBjeT0iMTEwIiByPSI4IiBmaWxsPSIjMDAwIi8+PGNpcmNsZSBjeD0iMTcwIiBjeT0iMTEwIiByPSI4IiBmaWxsPSIjMDAwIi8+PGVsbGlwc2UgY3g9IjE1MCIgY3k9IjEzNSIgcng9IjgiIHJ5PSI2IiBmaWxsPSIjMDAwIi8+PHBhdGggZD0iTTE0MiAxNDVRMTUwIDE1NSAxNTggMTQ1IiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMyIgZmlsbD0ibm9uZSIvPjx0ZXh0IHg9IjE1MCIgeT0iMjUwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTQ2MzBEIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIyMCI+QnVkZHk8L3RleHQ+PC9zdmc+',
      contact: 'sarah@example.com',
      ownerId: sampleUser1.id,
      featured: true,
    });

    petStorage.create({
      name: 'Luna',
      breed: 'Persian Cat',
      age: 2,
      gender: 'female',
      healthInfo: 'All vaccinations up to date, spayed',
      description: 'Beautiful and calm Persian cat. Very affectionate and loves to cuddle. Perfect for a quiet home.',
      image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9IiNGRkY4RjAiLz48Y2lyY2xlIGN4PSIxNTAiIGN5PSIxMjAiIHI9IjQ1IiBmaWxsPSIjRDRENEFBIi8+PHBvbHlnb24gcG9pbnRzPSIxMjAsOTAgMTMwLDc1IDEyNSw5NSIgZmlsbD0iI0Q0RDRBQSIvPjxwb2x5Z29uIHBvaW50cz0iMTgwLDkwIDE3MCw3NSAxNzUsOTUiIGZpbGw9IiNENEQ0QUEiLz48ZWxsaXBzZSBjeD0iMTM1IiBjeT0iMTEwIiByeD0iNiIgcnk9IjEwIiBmaWxsPSIjMDA3QkZGIi8+PGVsbGlwc2UgY3g9IjE2NSIgY3k9IjExMCIgcng9IjYiIHJ5PSIxMCIgZmlsbD0iIzAwN0JGRiIvPjx0cmlhbmdsZSBjeD0iMTUwIiBjeT0iMTI1IiByPSI1IiBmaWxsPSIjRkY2MUE2Ii8+PHBhdGggZD0iTTE0MCAzNTFRMTUwIDE0NSAxNjAgMTM1IiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMiIgZmlsbD0ibm9uZSIvPjx0ZXh0IHg9IjE1MCIgeT0iMjUwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTQ2MzBEIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIyMCI+THVuYTwvdGV4dD48L3N2Zz4=',
      contact: 'mike@example.com',
      ownerId: sampleUser2.id,
      featured: true,
    });

    petStorage.create({
      name: 'Max',
      breed: 'German Shepherd',
      age: 4,
      gender: 'male',
      healthInfo: 'Healthy, all shots current',
      description: 'Loyal and intelligent German Shepherd. Well-trained and great for families with children.',
      image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9IiNGRkY4RjAiLz48Y2lyY2xlIGN4PSIxNTAiIGN5PSIxMjAiIHI9IjUwIiBmaWxsPSIjOEI0NTEzIi8+PGNpcmNsZSBjeD0iMTMwIiBjeT0iMTEwIiByPSI4IiBmaWxsPSIjMDAwIi8+PGNpcmNsZSBjeD0iMTcwIiBjeT0iMTEwIiByPSI4IiBmaWxsPSIjMDAwIi8+PGVsbGlwc2UgY3g9IjE1MCIgY3k9IjEzNSIgcng9IjEwIiByeT0iOCIgZmlsbD0iIzAwMCIvPjxwYXRoIGQ9Ik0xNDAgMTQ1UTE1MCAzNTUgMTYwIDE0NSIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjMiIGZpbGw9Im5vbmUiLz48dGV4dCB4PSIxNTAiIHk9IjI1MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzk0NjMwRCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjAiPk1heDwvdGV4dD48L3N2Zz4=',
      contact: 'sarah@example.com',
      ownerId: sampleUser1.id,
      featured: true,
    });

    petStorage.create({
      name: 'Bella',
      breed: 'Labrador Mix',
      age: 1,
      gender: 'female',
      healthInfo: 'Young and healthy, all vaccinations current',
      description: 'Playful puppy looking for an active family. Loves treats and learning new tricks!',
      image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9IiNGRkY4RjAiLz48Y2lyY2xlIGN4PSIxNTAiIGN5PSIxMjAiIHI9IjQ1IiBmaWxsPSIjRkZENkI1Ii8+PGNpcmNsZSBjeD0iMTMwIiBjeT0iMzEwIiByPSI3IiBmaWxsPSIjMDAwIi8+PGNpcmNsZSBjeD0iMTcwIiBjeT0iMTEwIiByPSI3IiBmaWxsPSIjMDAwIi8+PGVsbGlwc2UgY3g9IjE1MCIgY3k9IjEzMCIgcng9IjciIHJ5PSI1IiBmaWxsPSIjMDAwIi8+PHBhdGggZD0iTTE0MyAzNDBRMTUwIDM1MCAzNTcgMzQwIiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMyIgZmlsbD0ibm9uZSIvPjx0ZXh0IHg9IjE1MCIgeT0iMjUwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTQ2MzBEIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIyMCI+QmVsbGE8L3RleHQ+PC9zdmc+',
      contact: 'mike@example.com',
      ownerId: sampleUser2.id,
      featured: true,
    });
  }
};