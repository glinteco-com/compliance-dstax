import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password'
import { ElementType } from 'react'
import { Control, Controller, FieldValues, Path } from 'react-hook-form'

type Props<FormType extends FieldValues, FieldProps> = {
  name: Path<FormType>
  control: Control<FormType>
  Field: ElementType
  fieldProps?: FieldProps
  hasDefaultBlur?: boolean
}
const textFields: ElementType[] = [Input, PasswordInput]

function FormController<FormType extends FieldValues, FieldProps>({
  name,
  control,
  fieldProps,
  Field,
  hasDefaultBlur = true,
}: Props<FormType, FieldProps>) {
  const isTextField = textFields.includes(Field)

  return (
    <div>
      <Controller
        control={control}
        name={name}
        render={({ field, fieldState }) => {
          const onBlur = (
            e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
          ) => {
            let value = e.target.value
            value = value.trim()
            field.onChange(value)
            e.target.value = value
            field.onBlur()
          }
          return (
            <Field
              {...field}
              value={field.value ?? ''}
              {...fieldProps}
              id={field.name}
              error={fieldState.error?.message}
              {...(hasDefaultBlur && isTextField ? { onBlur } : {})}
            />
          )
        }}
      />
    </div>
  )
}

export default FormController
