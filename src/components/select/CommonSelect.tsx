'use client'

import * as React from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

export interface SelectOption {
  value: string | number
  label: string
}

export interface CommonSelectProps {
  label?: string
  error?: string
  placeholder?: string
  options: SelectOption[]
  value?: string | number
  onChange?: (value: string | number) => void
  onBlur?: () => void
  disabled?: boolean
  className?: string
  id?: string
}

const CommonSelect = React.forwardRef<HTMLButtonElement, CommonSelectProps>(
  (
    {
      label,
      error,
      placeholder = 'Select an option',
      options,
      value,
      onChange,
      onBlur,
      disabled,
      className,
      id,
    },
    ref
  ) => {
    const internalId = React.useId()
    const selectId = id || internalId

    const handleValueChange = (val: string) => {
      // Find if original value was a number
      const originalOption = options.find((opt) => opt.value.toString() === val)
      if (originalOption) {
        onChange?.(originalOption.value)
      } else {
        onChange?.(val)
      }
    }

    const stringValue = value != null ? value.toString() : ''

    return (
      <div className="flex w-full flex-col gap-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {label}
          </label>
        )}
        <Select
          value={stringValue}
          onValueChange={handleValueChange}
          disabled={disabled}
        >
          <SelectTrigger
            ref={ref}
            id={selectId}
            className={cn(
              'w-full',
              error && 'border-destructive focus-visible:ring-destructive/20',
              className
            )}
            aria-invalid={!!error}
            onBlur={onBlur}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent className="max-h-80" position="popper">
            {options
              .filter((option) => option.value != null && option.value !== '')
              .map((option) => (
                <SelectItem
                  key={option.value.toString()}
                  value={option.value.toString()}
                >
                  {option.label}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
        {error && (
          <p className="text-destructive text-xs font-medium">{error}</p>
        )}
      </div>
    )
  }
)
CommonSelect.displayName = 'CommonSelect'

export { CommonSelect }
