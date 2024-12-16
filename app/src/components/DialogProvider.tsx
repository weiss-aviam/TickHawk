import React, { createContext, useContext, useMemo } from 'react'

export type DialogType = {
  className?: string
  title: string
  content: string
  primaryAction: string
  secondaryAction: string
  onClose: [() => void]
  onPrimaryAction: [() => void]
  onSecondaryAction: [() => void]
}

const Dialog = ({ dialog }: { dialog: DialogType }) => {
  const handleClose = () => {
    for (const onClose of dialog.onClose) {
      onClose()
    }
  }

  const handlePrimaryAction = () => {
    for (const onPrimaryAction of dialog.onPrimaryAction) {
      onPrimaryAction()
    }
  }

  const handleSecondaryAction = () => {
    for (const onSecondaryAction of dialog.onSecondaryAction) {
      onSecondaryAction()
    }
  }

  return (
    <div className='z-[30] fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'>
      <div className='max-w-96  w-full bg-white dark:bg-gray-800 relative p-4'>
        <h5 className='inline-flex items-center mb-4 text-sm font-semibold text-gray-500 uppercase dark:text-gray-400'>
          {dialog.title}
        </h5>
        <button
          onClick={handleClose}
          className='text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 absolute top-2.5 right-2.5 inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white'
        >
          <svg
            className='w-5 h-5'
            fill='currentColor'
            viewBox='0 0 20 20'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              fillRule='evenodd'
              d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
              clipRule='evenodd'
            ></path>
          </svg>
          <span className='sr-only'>Close menu</span>
        </button>
        <div className='mb-5'>
          <p className='text-gray-900 dark:text-white'>{dialog.content}</p>
        </div>
        <div className=''>
          <div className='bottom-0 left-0 flex justify-end w-full space-x-4 md:px-4'>
            <button
              onClick={handlePrimaryAction}
              className='text-white justify-center bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800'
            >
              {dialog.primaryAction}
            </button>
            {dialog.secondaryAction === '' ? null : (
              <button
                onClick={handleSecondaryAction}
                className='inline-flex justify-center text-gray-500 items-center bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600'
              >
                {dialog.secondaryAction}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const DialogContext = createContext({})

const DialogProvider = ({ children }: { children: React.ReactNode }) => {
  const [dialog, setDialog] = React.useState<DialogType | null>(null)

  const openDialog = (dialog: DialogType) => {
    if (!dialog.onClose) dialog.onClose = [() => closeDialog()]
    else dialog.onClose.push(() => closeDialog())

    if (!dialog.onPrimaryAction) dialog.onPrimaryAction = [() => closeDialog()]
    else dialog.onPrimaryAction.push(() => closeDialog())

    if (!dialog.onSecondaryAction) dialog.onSecondaryAction = [() => closeDialog()]
    else dialog.onSecondaryAction.push(() => closeDialog())

    setDialog(dialog)
  }

  const closeDialog = () => {
    setDialog(null)
  }

  const contextValue = useMemo(
    () => ({
      openDialog,
      closeDialog,
      dialog
    }),
    // eslint-disable-next-line
    []
  )
  return (
    <DialogContext.Provider value={contextValue as DialogContextType}>
      {dialog && <Dialog dialog={dialog} />}
      {children}
    </DialogContext.Provider>
  )
}

type DialogContextType = {
  openDialog: (dialog: DialogType) => void
  closeDialog: () => void
  dialog: DialogType | null
}

export const useDialog = (): any => {
  return useContext(DialogContext)
}

export default DialogProvider
