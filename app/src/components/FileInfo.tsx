import { toast } from 'react-toastify'
import { useAuth } from './AuthProvider'

export type FileInfoType = {
  className?: string
  file: {
    _id: string
    name: string
    mimetype: string
  }
}

export default function FileInfo ({ className, file }: FileInfoType) {
  const auth = useAuth()
  const downloadFile = async () => {
    try {
      const response = await auth.axiosClient.get(`/ticket/file/${file._id}`, {responseType: 'arraybuffer'})
      if (!response.data || response.status !== 200) {
        toast.error('Error downloading file')
      }
      const blob = new Blob([response.data])
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = file.name
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      toast.error('Error downloading file')
    }
  }
  return (
    <div className='flex items-center p-3 mb-3.5 border border-gray-200 dark:border-gray-700 rounded-lg'>
      <div className='flex items-center justify-center w-10 h-10 mr-3 rounded-lg bg-primary-100 dark:bg-primary-900'>
        <svg
          className='w-5 h-5 text-primary-600 lg:w-6 lg:h-6 dark:text-primary-300'
          fill='currentColor'
          viewBox='0 0 24 24'
          xmlns='http://www.w3.org/2000/svg'
          aria-hidden='true'
        >
          <path
            clipRule='evenodd'
            fillRule='evenodd'
            d='M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a1.875 1.875 0 01-1.875-1.875V5.25A3.75 3.75 0 009 1.5H5.625zM7.5 15a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 017.5 15zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H8.25z'
          ></path>
          <path d='M12.971 1.816A5.23 5.23 0 0114.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 013.434 1.279 9.768 9.768 0 00-6.963-6.963z'></path>
        </svg>
      </div>
      <div className='mr-4'>
        <p className='text-sm font-semibold text-gray-900 dark:text-white'>
          {file.name}
        </p>
      </div>
      <div className='flex items-center ml-auto'>
        <button
          onClick={downloadFile}
          className='p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700'
        >
          <svg
            className='w-5 h-5 text-gray-500 dark:text-gray-400'
            fill='currentColor'
            viewBox='0 0 24 24'
            xmlns='http://www.w3.org/2000/svg'
            aria-hidden='true'
          >
            <path
              clipRule='evenodd'
              fillRule='evenodd'
              d='M12 2.25a.75.75 0 01.75.75v11.69l3.22-3.22a.75.75 0 111.06 1.06l-4.5 4.5a.75.75 0 01-1.06 0l-4.5-4.5a.75.75 0 111.06-1.06l3.22 3.22V3a.75.75 0 01.75-.75zm-9 13.5a.75.75 0 01.75.75v2.25a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5V16.5a.75.75 0 011.5 0v2.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V16.5a.75.75 0 01.75-.75z'
            ></path>
          </svg>
          <span className='sr-only'>Download</span>
        </button>
      </div>
    </div>
  )
}
