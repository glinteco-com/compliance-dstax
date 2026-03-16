'use client'

import * as React from 'react'
import { Calendar } from '@/components/ui/calendar'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

function formatDate(date: Date | undefined) {
  if (!date) {
    return ''
  }

  return date.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

function isValidDate(date: Date | undefined) {
  if (!date) {
    return false
  }
  return !isNaN(date.getTime())
}

export interface DatePickerInputProps {
  value?: string
  onChange?: (value: string) => void
  label?: string
  error?: string
  disabled?: boolean
  className?: string
  id?: string
  placeholder?: string
}

export function DatePickerInput({
  value,
  onChange,
  label,
  error,
  disabled,
  className,
  id,
  placeholder = 'Select date',
}: DatePickerInputProps) {
  const [open, setOpen] = React.useState(false)
  const generatedId = React.useId()
  const inputId = id || generatedId

  // Internal state for the displayed text value
  const [inputValue, setInputValue] = React.useState('')

  // Sync internal input value with external value
  React.useEffect(() => {
    if (value) {
      const date = new Date(value)
      if (isValidDate(date)) {
        setInputValue(formatDate(date))
      } else {
        setInputValue(value)
      }
    } else {
      setInputValue('')
    }
  }, [value])

  const selectedDate = value ? new Date(value) : undefined
  const [month, setMonth] = React.useState<Date | undefined>(
    selectedDate && isValidDate(selectedDate) ? selectedDate : new Date()
  )

  const handleSelect = (date: Date | undefined) => {
    if (date) {
      const formattedValue = date.toISOString().split('T')[0]
      onChange?.(formattedValue)
      setInputValue(formatDate(date))
      setOpen(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value
    setInputValue(newVal)

    const parsedDate = new Date(newVal)
    if (isValidDate(parsedDate)) {
      onChange?.(parsedDate.toISOString().split('T')[0])
      setMonth(parsedDate)
    }
  }

  return (
    <div className={cn('flex w-full flex-col gap-1.5', className)}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {label}
        </label>
      )}
      <InputGroup>
        <InputGroupInput
          id={inputId}
          value={inputValue}
          placeholder={placeholder}
          disabled={disabled}
          onChange={handleInputChange}
          onFocus={() => !disabled && setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown' && !disabled) {
              e.preventDefault()
              setOpen(true)
            }
          }}
        />
        <InputGroupAddon align="inline-end">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <InputGroupButton
                id={`${inputId}-picker`}
                variant="ghost"
                size="icon-xs"
                aria-label="Select date"
                disabled={disabled}
              >
                <CalendarIcon className="size-4" />
                <span className="sr-only">Select date</span>
              </InputGroupButton>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto overflow-hidden p-0"
              align="end"
              alignOffset={-8}
              sideOffset={10}
            >
              <Calendar
                mode="single"
                selected={
                  selectedDate && isValidDate(selectedDate)
                    ? selectedDate
                    : undefined
                }
                month={month}
                onMonthChange={setMonth}
                onSelect={handleSelect}
                disabled={disabled}
              />
            </PopoverContent>
          </Popover>
        </InputGroupAddon>
      </InputGroup>
      {error && <p className="text-destructive text-xs font-medium">{error}</p>}
    </div>
  )
}
