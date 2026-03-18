import { Button } from '@/components/ui/button'
import dayjs from 'dayjs'
import { Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react'
import * as React from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { FieldError } from 'react-hook-form'
import './date-picker.css'
import { cn } from '@/lib/utils'
import { YEAR_FORMAT_SERVER } from '@/constants/date'
import { formatDate } from '@/lib/date'

export type InputDatePickerProps = {
  value?: string
  onChange?: (date?: string) => void
  placeholder?: string
  label?: string
  error?: FieldError
  disabled?: boolean
  required?: boolean
  errorMessage?: string
  className?: string
  showTimeSelect?: boolean
  dateFormat?: string
  timeFormat?: string
  timeIntervals?: number
  outputFormat?: string
  minDate?: Date
  maxDate?: Date
  filterTime?: (date: Date) => boolean
}

export const InputDatePicker = React.forwardRef<
  HTMLInputElement,
  InputDatePickerProps
>(
  (
    {
      value,
      onChange,
      placeholder = 'DD/MM/YYYY',
      disabled,
      label,
      error,
      required,
      className,
      showTimeSelect,
      dateFormat = 'dd/MM/yyyy',
      timeFormat = 'HH:mm',
      timeIntervals = 15,
      outputFormat,
      minDate,
      maxDate,
      filterTime,
      errorMessage,
      ...props
    },
    ref
  ) => {
    const id = React.useId()

    // Determine default output format based on whether time is selected
    const effectiveOutputFormat =
      outputFormat ||
      (showTimeSelect ? 'YYYY-MM-DD HH:mm:ss' : YEAR_FORMAT_SERVER)

    const handleSelect = (selected: Date | null) => {
      if (selected) {
        onChange?.(formatDate(selected, effectiveOutputFormat))
      }
    }

    return (
      <div className="flex w-full flex-col gap-1.5">
        {label && (
          <label
            htmlFor={id}
            className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {label} {required && <span className="text-destructive">*</span>}
          </label>
        )}

        <div className="relative flex items-center">
          <DatePicker
            id={id}
            showIcon={true}
            icon={<Calendar className="size-4" />}
            selected={value ? dayjs(value).toDate() : undefined}
            onChange={(date: Date | null) => handleSelect(date)}
            selectsMultiple={false}
            selectsRange={false}
            toggleCalendarOnIconClick
            placeholderText={placeholder}
            showTimeSelect={showTimeSelect}
            dateFormat={dateFormat}
            timeFormat={timeFormat}
            timeIntervals={timeIntervals}
            minDate={minDate}
            maxDate={maxDate}
            filterTime={filterTime}
            dayClassName={(date) => {
              const day = date.getDay()
              return day === 0 || day === 6
                ? 'react-datepicker__day--weekend'
                : ''
            }}
            renderCustomHeader={({
              date,
              changeYear,
              changeMonth,
              decreaseMonth,
              increaseMonth,
              prevMonthButtonDisabled,
              nextMonthButtonDisabled,
            }) => {
              const currentYear = new Date().getFullYear()
              const years = Array.from(
                { length: 150 },
                (_, i) => currentYear + 50 - i
              )
              const months = Array.from({ length: 12 }, (_, i) =>
                dayjs().month(i).format('MMMM')
              )

              return (
                <div className="flex items-center justify-between rounded-t px-2 py-1">
                  <Button
                    variant={'ghost'}
                    type="button"
                    onClick={decreaseMonth}
                    disabled={prevMonthButtonDisabled}
                    className="px-2 py-1 text-sm"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>

                  <div className="flex gap-2">
                    <select
                      value={date?.getFullYear()}
                      onChange={({ target: { value } }) =>
                        changeYear(Number(value))
                      }
                      className="rounded border bg-white px-1 py-0.5 text-sm outline-none focus:ring-1 focus:ring-orange-500"
                    >
                      {years.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>

                    <select
                      value={months[date?.getMonth()]}
                      onChange={({ target: { value } }) =>
                        changeMonth(months.indexOf(value))
                      }
                      className="rounded border bg-white px-1 py-0.5 text-sm outline-none focus:ring-1 focus:ring-orange-500"
                    >
                      {months?.map((month) => (
                        <option key={month} value={month}>
                          {month}
                        </option>
                      ))}
                    </select>
                  </div>

                  <Button
                    variant={'ghost'}
                    type="button"
                    onClick={increaseMonth}
                    disabled={nextMonthButtonDisabled}
                    className="px-2 py-1 text-sm"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )
            }}
            className={cn(
              'border-input selection:bg-primary selection:text-primary-foreground file:text-foreground placeholder:text-muted-foreground dark:bg-input/30 h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
              'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
              'aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40',
              'caret-orange-600',
              'pl-9!',
              className
            )}
            disabled={disabled}
            aria-invalid={!!error ? 'true' : 'false'}
            {...props}
          />
          {value && !disabled && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onChange?.(undefined)
              }}
              className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-destructive text-xs font-medium">
            {typeof error === 'string' ? error : error.message}
          </p>
        )}
      </div>
    )
  }
)

InputDatePicker.displayName = 'InputDatePicker'
