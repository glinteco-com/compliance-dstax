'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Eye, EyeOff, Mail } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        // Redirect or show success
      } else {
        // Handle login error
      }
    } catch (error) {
      console.error('Login failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col items-center bg-white p-8 shadow-lg">
      {/* Logo Placeholder */}
      <div className="mb-8 flex flex-col items-center">
        <div className="bg-brand-navy-500 flex h-[60px] w-[60px] text-xs font-bold text-white">
          <div className="relative flex h-full w-full flex-1 flex-col">
            <div className="flex h-full w-full text-[10px] leading-[10px]">
              <div className="border-brand-gray-500/30 flex flex-1 flex-col items-center justify-around border-r">
                <span>D</span>
                <span></span>
                <span></span>
              </div>
              <div className="border-brand-gray-500/30 flex flex-1 flex-col items-center justify-around border-r">
                <span>S</span>
                <div className="h-[70%] w-1/2 bg-gray-400"></div>
              </div>
              <div className="flex flex-1 flex-col items-center justify-around">
                <span>T</span>
                <span>a</span>
                <span>x</span>
              </div>
            </div>
          </div>
        </div>
        <span className="text-brand-gray-500 mt-1 text-[10px]">Consulting</span>
      </div>

      <form className="w-full space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">
            Email address
          </label>
          <div className="relative">
            <Input
              {...register('email')}
              type="email"
              placeholder="name@mail.com"
              className={`rounded-none border-gray-300 pr-10 focus-visible:ring-1 focus-visible:ring-gray-400 ${
                errors.email ? 'border-red-500' : ''
              }`}
            />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <Mail className="h-4 w-4 text-gray-400" />
            </div>
          </div>
          {errors.email && (
            <p className="text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Password</label>
          <div className="relative">
            <Input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              className={`rounded-none border-gray-300 pr-10 focus-visible:ring-1 focus-visible:ring-gray-400 ${
                errors.password ? 'border-red-500' : ''
              }`}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
              ) : (
                <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-red-500">{errors.password.message}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="bg-brand-orange-500 hover:bg-brand-orange-600 mt-6 h-10 w-full rounded-none text-white"
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </Button>

        <div className="mt-4 text-center">
          <a href="#" className="text-[11px] text-gray-500 hover:text-gray-700">
            Forgot your password?
          </a>
        </div>
      </form>
    </div>
  )
}
