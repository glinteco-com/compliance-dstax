import * as React from 'react'

import { cn } from '@/lib/utils'

export interface InputProps extends React.ComponentProps<'input'> {
  label?: string
  error?: string
  prefixIcon?: React.ReactNode
  suffixIcon?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, type, label, error, prefixIcon, suffixIcon, ...props },
    ref
  ) => {
    const id = React.useId()
    const inputId = props.id || id

    return (
      <div className="flex w-full flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {prefixIcon && (
            <div className="text-muted-foreground absolute left-3 flex items-center justify-center [&_svg]:size-4">
              {prefixIcon}
            </div>
          )}
          <input
            id={inputId}
            type={type}
            ref={ref}
            data-slot="input"
            className={cn(
              'border-input selection:bg-primary selection:text-primary-foreground file:text-foreground placeholder:text-muted-foreground dark:bg-input/30 h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
              'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
              'aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40',
              'caret-orange-600',
              prefixIcon && 'pl-9',
              suffixIcon && 'pr-9',
              className
            )}
            aria-invalid={!!error}
            {...props}
          />
          {suffixIcon && (
            <div className="text-muted-foreground absolute right-3 flex items-center justify-center [&_svg]:size-4">
              {suffixIcon}
            </div>
          )}
        </div>
        {error && (
          <p className="text-destructive text-xs font-medium">{error}</p>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'

export { Input }
