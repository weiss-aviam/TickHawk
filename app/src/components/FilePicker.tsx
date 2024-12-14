import { FileModel } from 'models/file.model'
import { useRef } from 'react'
import { toast } from 'react-toastify'
import { useAuth } from './AuthProvider'
import AttachmentIcon from './icons/AttachmentIcon'

type FileUploaderProps = {
  onFilesUploaded: (files: FileModel[]) => void
}
function FileUploader ({ onFilesUploaded }: FileUploaderProps) {
  const inputRef = useRef(null)
  const auth = useAuth()
  const notifyFileSize = () => toast.error('File size should be less than 3mb')
  

  const handleDragOver = (ev: React.DragEvent<HTMLDivElement>) => {
    ev.preventDefault()
    ev.stopPropagation()
    ev.dataTransfer.dropEffect = 'copy'
    if (inputRef.current) {
      ;(inputRef.current as any).click()
    }
  }

  const handleClick = () => {
    if (inputRef.current) {
      ;(inputRef.current as any).click()
    }
  }

  const handleDrop = async (ev: React.DragEvent<HTMLDivElement>) => {
    ev.preventDefault()
    ev.stopPropagation()
    // Size of files < 3mb, then alert
    for (let i = 0; i < ev.dataTransfer.files.length; i++) {
      if (ev.dataTransfer.files[i].size > 3 * 1024 * 1024) {
        notifyFileSize()
        return
      }
    }
    await onChange(ev.dataTransfer.files);
    (ev.target as HTMLInputElement).value = '';
  }

  const handleChange = async (ev: React.ChangeEvent<HTMLInputElement>) => {
    if (!ev.target.files) return
    // Size of files < 3mb, then alert
    for (let i = 0; i < ev.target.files.length; i++) {
      if (ev.target.files[i].size > 3 * 1024 * 1024) {
        notifyFileSize()
        return
      }
    }
    await onChange(ev.target.files);
    (ev.target as HTMLInputElement).value = '';
  }

  // Function to handle file upload
  const onChange = async (files: FileList) => {
    const filesUploaded = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i]

      const formData = new FormData();
      formData.append('file', file); 

      const response = await auth.axiosClient.post('/file/ticket', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      if (response.status !== 201) {
        toast.error('Failed to upload file with name: ' + file.name)
        return
      }

      const fileModel: FileModel = response.data;
      filesUploaded.push(fileModel)
    }
    
    onFilesUploaded(filesUploaded)
  }

  return (
    <span
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className='ml-auto inline-flex justify-center p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600'
    >
      <AttachmentIcon />
      <span className='sr-only'>Attach file</span>
      <input
        type='file'
        aria-label='add files'
        className='sr-only'
        ref={inputRef}
        multiple={true}
        onChange={handleChange}
        accept='image/*, video/*, audio/*, .pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx, .txt, .zip, .rar'
      />
    </span>
  )
}

export default FileUploader
