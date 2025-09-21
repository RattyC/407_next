"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react';
import type { Student } from "@/types";

type State = {
  students: Student[];
};

type Action =
  | { type: 'add'; payload: Student }
  | { type: 'update'; payload: Student }
  | { type: 'remove'; payload: { id: string } }
  | { type: 'hydrate'; payload: Student[] }
  | { type: 'set'; payload: Student[] };

const initialState: State = { students: [] };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'add':
      return { ...state, students: [action.payload, ...state.students] };
    case 'update':
      return {
        ...state,
        students: state.students.map((s) => (s.id === action.payload.id ? action.payload : s)),
      };
    case 'remove':
      return { ...state, students: state.students.filter((s) => s.id !== action.payload.id) };
    case 'hydrate':
      return { ...state, students: action.payload };
    case 'set':
      return { ...state, students: action.payload };
    default:
      return state;
  }
}

type Ctx = State & {
  addStudent: (student: Student) => void;
  updateStudent: (student: Student) => void;
  removeStudent: (id: string) => void;
  setStudents: (students: Student[]) => void;
  clearStudents: () => void;
};

const PortfolioContext = createContext<Ctx | null>(null);

const STORAGE_KEY = 'tcas69_portfolios_v1';

export function PortfolioProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // hydrate from localStorage
  useEffect(() => {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
      if (raw) {
        const parsed = JSON.parse(raw) as Student[];
        dispatch({ type: 'hydrate', payload: parsed });
      }
    } catch {
      // ignore
    }
  }, []);

  // persist to localStorage
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.students));
      }
    } catch {
      // ignore
    }
  }, [state.students]);

  const addStudent = useCallback((student: Student) => dispatch({ type: 'add', payload: student }), []);
  const updateStudent = useCallback((student: Student) => dispatch({ type: 'update', payload: student }), []);
  const removeStudent = useCallback((id: string) => dispatch({ type: 'remove', payload: { id } }), []);
  const setStudents = useCallback((students: Student[]) => dispatch({ type: 'set', payload: students }), []);
  const clearStudents = useCallback(() => dispatch({ type: 'set', payload: [] }), []);

  const value = useMemo(
    () => ({ students: state.students, addStudent, updateStudent, removeStudent, setStudents, clearStudents }),
    [state.students, addStudent, updateStudent, removeStudent, setStudents, clearStudents]
  );

  return <PortfolioContext.Provider value={value}>{children}</PortfolioContext.Provider>;
}

export function usePortfolio() {
  const ctx = useContext(PortfolioContext);
  if (!ctx) throw new Error('usePortfolio must be used within PortfolioProvider');
  return ctx;
}
