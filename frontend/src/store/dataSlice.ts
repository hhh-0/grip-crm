import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  address?: string;
  createdAt: string;
}

interface Ticket {
  id: string;
  title: string;
  description: string;
  stage: 'NEW' | 'IN_PROGRESS' | 'WAITING' | 'COMPLETED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  customerName: string;
  assignedTo?: string;
  resolvedBy?: string;
  resolvedAt?: string;
  createdAt: string;
  updatedAt?: string;
}

interface DataState {
  customers: Customer[];
  tickets: Ticket[];
}

const initialState: DataState = {
  customers: [],
  tickets: [],
};

// Load data from localStorage
const loadFromStorage = (): DataState => {
  try {
    const customers = localStorage.getItem('grip_customers');
    const tickets = localStorage.getItem('grip_tickets');
    
    return {
      customers: customers ? JSON.parse(customers) : [],
      tickets: tickets ? JSON.parse(tickets) : [],
    };
  } catch (error) {
    console.error('Error loading data from localStorage:', error);
    return initialState;
  }
};

// Save data to localStorage
const saveToStorage = (state: DataState) => {
  try {
    localStorage.setItem('grip_customers', JSON.stringify(state.customers));
    localStorage.setItem('grip_tickets', JSON.stringify(state.tickets));
  } catch (error) {
    console.error('Error saving data to localStorage:', error);
  }
};

const dataSlice = createSlice({
  name: 'data',
  initialState: loadFromStorage(),
  reducers: {
    // Customer actions
    addCustomer: (state, action: PayloadAction<Customer>) => {
      state.customers.push(action.payload);
      saveToStorage(state);
    },
    updateCustomer: (state, action: PayloadAction<Customer>) => {
      const index = state.customers.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.customers[index] = action.payload;
        saveToStorage(state);
      }
    },
    deleteCustomer: (state, action: PayloadAction<string>) => {
      state.customers = state.customers.filter(c => c.id !== action.payload);
      saveToStorage(state);
    },
    
    // Ticket actions
    addTicket: (state, action: PayloadAction<Ticket>) => {
      state.tickets.push(action.payload);
      saveToStorage(state);
    },
    updateTicket: (state, action: PayloadAction<Ticket>) => {
      const index = state.tickets.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        state.tickets[index] = action.payload;
        saveToStorage(state);
      }
    },
    deleteTicket: (state, action: PayloadAction<string>) => {
      state.tickets = state.tickets.filter(t => t.id !== action.payload);
      saveToStorage(state);
    },
    
    // Load data action
    loadData: (state) => {
      const data = loadFromStorage();
      state.customers = data.customers;
      state.tickets = data.tickets;
    },
  },
});

export const {
  addCustomer,
  updateCustomer,
  deleteCustomer,
  addTicket,
  updateTicket,
  deleteTicket,
  loadData,
} = dataSlice.actions;

export default dataSlice.reducer;
export type { Customer, Ticket };