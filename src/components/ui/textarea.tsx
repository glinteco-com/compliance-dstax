import * as React from 'react'

import { cn } from '@/lib/utils'

export interface TextareaProps extends React.ComponentProps<'textarea'> {
  label?: string
  error?: string
  prefixIcon?: React.ReactNode
  suffixIcon?: React.ReactNode
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, prefixIcon, suffixIcon, ...props }, ref) => {
    const id = React.useId()
    const textareaId = props.id || id

    return (
      <div className="flex w-full flex-col gap-1.5">
        {label && (
          <label
            htmlFor={textareaId}
            className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-start">
          {prefixIcon && (
            <div className="text-muted-foreground absolute top-2 left-3 flex items-center justify-center [&_svg]:size-4">
              {prefixIcon}
            </div>
          )}
          <textarea
            id={textareaId}
            ref={ref}
            data-slot="textarea"
            className={cn(
              'border-input selection:bg-primary selection:text-primary-foreground placeholder:text-muted-foreground dark:bg-input/30 flex min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
              'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
              'aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40',
              'field-sizing-content',
              'caret-orange-600',
              prefixIcon && 'pl-9',
              suffixIcon && 'pr-9',
              className
            )}
            aria-invalid={!!error}
            {...props}
          />
          {suffixIcon && (
            <div className="text-muted-foreground absolute top-2 right-3 flex items-center justify-center [&_svg]:size-4">
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
Textarea.displayName = 'Textarea'

export { Textarea }
