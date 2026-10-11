export type Page =
  | 'login'
  | 'register'
  | 'forgot-password'
  | 'dashboard'
  | 'users'
  | 'transactions'
  | 'accounts'

export interface User {
  id: string
  name: string
  cedula: string
  correo: string
  role: 'admin' | 'contador' | 'tesorero' | 'vocal'
  status: 'activo' | 'inactivo'
  createdAt: string
}

export interface Account {
  id: string
  name: string
  type: 'banco' | 'caja' | 'inversion' | 'credito'
  balance: number
  currency: string
  description: string
}

export interface Transaction {
  id: string
  type: 'ingreso' | 'egreso'
  description: string
  amount: number
  accountId: string
  accountName: string
  category: string
  date: string
  notes?: string
  createdBy: string
}
