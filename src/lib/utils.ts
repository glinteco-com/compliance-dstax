import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
export {
  getApiErrorMessage,
  type ApiErrorResponse,
  type ApiErrorItem,
} from '@/api/mutator/custom-instance'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
