'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password'
import FormController from '@/components/ui/FormController'
import { Mail } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useRouter } from 'next/navigation'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const { control, handleSubmit } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        router.push('/')
        router.refresh()
      } else {
        const errorText = await response.text()
        setError(errorText || 'Invalid credentials')
      }
    } catch (error) {
      console.error('Login failed:', error)
      setError('An unexpected error occurred')
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

      {error && (
        <div className="mb-4 w-full border border-red-200 bg-red-50 p-3 text-center text-sm text-red-600">
          {error}
        </div>
      )}

      <form className="w-full space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <FormController
          control={control}
          name="email"
          Field={Input}
          fieldProps={{
            label: 'Email address',
            type: 'email',
            placeholder: 'name@mail.com',
            className:
              'rounded-none border-gray-300 focus-visible:ring-1 focus-visible:ring-gray-400',
            prefixIcon: <Mail />,
          }}
        />

        <FormController
          control={control}
          name="password"
          Field={PasswordInput}
          fieldProps={{
            label: 'Password',
            placeholder: 'Password',
            className:
              'rounded-none border-gray-300 focus-visible:ring-1 focus-visible:ring-gray-400',
          }}
        />

        <Button
          type="submit"
          isLoading={isLoading}
          className="bg-brand-orange-500 hover:bg-brand-orange-600 mt-6 h-10 w-full rounded-none text-white"
        >
          Login
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
