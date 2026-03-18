import { useCallback, useState } from 'react'

const useDialog = (initialOpen?: boolean) => {
  const [isOpenDialog, setIsOpenDialog] = useState(initialOpen ?? false)

  const onOpenDialog = useCallback(() => {
    setIsOpenDialog(true)
  }, [])

  const onCloseDialog = useCallback(() => {
    setIsOpenDialog(false)
  }, [])

  return { isOpenDialog, onOpenDialog, onCloseDialog, setIsOpenDialog }
}

export default useDialog
