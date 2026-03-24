'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password'
import FormController from '@/components/form/FormController'
import { Mail } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function LoginForm() {
  const router = useRouter()
  const { signInMutation } = useAuth()

  const { control, handleSubmit } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = (data: LoginFormValues) => {
    signInMutation.mutate(
      { data },
      {
        onSuccess: () => {
          router.push('/')
          router.refresh()
        },
        onError: (err: any) => {
          console.error('Login failed:', err)
          const dataError = err.response?.data
          const errorMessage =
            dataError?.errors?.detail ||
            dataError?.detail ||
            (typeof dataError === 'string' ? dataError : null) ||
            err.message ||
            'An unexpected error occurred'

          toast.error(
            typeof errorMessage === 'string'
              ? errorMessage
              : 'Invalid credentials'
          )
        },
      }
    )
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
        <FormController
          control={control}
          name="email"
          Field={Input}
          fieldProps={{
            label: 'Email address',
            type: 'email',
            placeholder: 'name@mail.com',
            className:
              'border-gray-300 focus-visible:ring-1 focus-visible:ring-gray-400',
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
              'border-gray-300 focus-visible:ring-1 focus-visible:ring-gray-400',
          }}
        />

        <Button
          type="submit"
          isLoading={signInMutation.isPending}
          className="bg-brand-orange-500 hover:bg-brand-orange-600 mt-6 h-10 w-full text-white"
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
