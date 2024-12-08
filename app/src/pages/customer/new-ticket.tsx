import { useAuth } from 'components/AuthProvider'
import FilePicker from 'components/FilePicker'
import StatusBadge from 'components/StatusBadge'
import { FileModel } from 'models/file.model'
import React from 'react'
import { useNavigate } from 'react-router-dom'

function NewTicket () {
  const navigate = useNavigate()
  const auth = useAuth()
  const [departments, setDepartments] = React.useState([])
  const [error, setError] = React.useState('')
  const [files, setFiles] = React.useState<FileModel[]>([])

  React.useEffect(() => {
    auth.axiosClient.get('/department').then((response: any) => {
      setDepartments(response.data)
    })
  }, [auth.axiosClient])

  const handleFilesUploaded = async (_files: FileModel[]) => {
    setFiles([...files, ..._files])
  }

  const handleCreateTicket = (event: any) => {
    event.preventDefault()
    const form = event.target
    const formData = new FormData(form)
    const content = formData.get('content')?.toString()

    // Has department
    if (
      !formData.get('department') ||
      formData.get('department') === 'select'
    ) {
      setError('Please select a department')
      return
    }

    // Has subject
    if (!formData.get('subject')) {
      setError('Please enter a subject')
      return
    }

    // Has content and max content length is 600
    if (!content) {
      setError('Please enter a content')
      return
    }

    if (content && content.length > 600) {
      setError('Content must be less than 600 characters')
      return
    }

    // Create ticket
    const data = {
      subject: formData.get('subject'),
      content: formData.get('content'),
      priority: formData.get('priority'),
      departmentId: formData.get('department'),
      files: files.map((file: FileModel) => file._id)
    }
    auth.axiosClient.post('/ticket/customer', data).then((response: any) => {
      if (response.status !== 201) {
        setError('Failed to create ticket')
        return
      }

      const ticketId = response.data._id
      form.reset()
      navigate(`/ticket/${ticketId}`)
    })
  }
  return (
    <div>
      <div className='bg-gray-50 dark:bg-gray-900 min-h-screen'>
        <div className='container px-4 pt-20 mx-auto sm:pt-24 md:pt-24 lg:px-0 dark:bg-gray-900'>
          <form
            onSubmit={handleCreateTicket}
            className='grid gap-4 xl:grid-cols-3 2xl:grid-cols-4'
          >
            <div className='p-4 mb-5 bg-white border border-gray-200 rounded-lg shadow-sm xl:col-span-2 2xl:col-span-3 dark:border-gray-700 sm:p-6 dark:bg-gray-800'>
              <h3 className='mb-4 text-xl font-semibold dark:text-white'>
                New ticket
              </h3>

              <hr className='mb-5 border-gray-300 dark:border-gray-600' />
              <div className='mb-6 max-w-96'>
                <label className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                  Subject
                </label>
                <input
                  type='text'
                  name='subject'
                  id='subject'
                  className='shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500'
                  placeholder='Enter subject here'
                />
              </div>

              <div className=''>
                <label className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                  Content
                </label>
                <div className='w-full border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600'>
                  <div className='px-4 py-2 bg-white rounded-t-lg dark:bg-gray-800'>
                    <label className='sr-only'>Write your message</label>
                    <textarea
                      id='content'
                      name='content'
                      rows={8}
                      className='w-full px-0 text-sm outline-none text-gray-900 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400'
                      placeholder='Write your message'
                    ></textarea>
                  </div>
                  <div className='flex items-center justify-between px-3 py-2 border-t dark:border-gray-600'>
                    <div>
                      {files.map((file: FileModel) => (
                        <div
                          key={file._id}
                          className='flex items-center space-x-2'
                        >
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            className='w-6 h-6 text-gray-400 dark:text-gray-500'
                            x='0px'
                            y='0px'
                            width='100'
                            height='100'
                            viewBox='0 0 24 24'
                            fill='currentColor'
                          >
                            <path d='M13.172,2H6C4.9,2,4,2.9,4,4v16c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2V8.828c0-0.53-0.211-1.039-0.586-1.414l-4.828-4.828 C14.211,2.211,13.702,2,13.172,2z M18.5,9H13V3.5L18.5,9z'></path>
                          </svg>

                          <span className='text-sm font-medium text-gray-900 dark:text-white'>
                            {file.name}
                          </span>

                          <button
                            type='button'
                            className='text-sm font-medium text-red-500 dark:text-red-500'
                            onClick={() => {
                              setFiles(files.filter(f => f._id !== file._id))
                            }}
                          >
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              className='w-4 h-4'
                              fill='none'
                              viewBox='0 0 24 24'
                              stroke='currentColor'
                            >
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth='2'
                                d='M6 18L18 6M6 6l12 12'
                              ></path>
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                    <FilePicker onFilesUploaded={handleFilesUploaded} />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className='p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 sm:p-6 dark:bg-gray-800'>
                <h3 className='mb-4 text-xl font-semibold dark:text-white'>
                  Ticket
                </h3>
                <ul className='divide-y divide-gray-200 dark:divide-gray-700'>
                  <li className='py-4'>
                    <div className='flex items-center space-x-4 dark:border-gray-700'>
                      <div className='flex-1 min-w-0'>
                        <span className='block text-base font-semibold text-gray-900 truncate dark:text-white'>
                          Status
                        </span>
                      </div>
                      <div className='inline-flex items-center'>
                        <StatusBadge status='open' />
                      </div>
                    </div>
                  </li>

                  <li className='py-4'>
                    <div className='flex items-center space-x-4'>
                      <div className='flex-1 min-w-0'>
                        <span className='block text-base font-semibold text-gray-900 truncate dark:text-white'>
                          Priority
                        </span>
                      </div>
                      <div className='inline-flex items-center'>
                        <div className='flex-1 min-w-0'>
                          <select
                            id='priority'
                            name='priority'
                            className='bg-gray-50 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500'
                          >
                            <option value='low'>Low</option>
                            <option value='medium'>Medium</option>
                            <option value='high'>High</option>
                            <option value='critical'>Critical</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </li>

                  <li className='py-4'>
                    <div className='flex items-center space-x-4'>
                      <div className='flex-1 min-w-0'>
                        <span className='block text-base font-semibold text-gray-900 truncate dark:text-white'>
                          Department
                        </span>
                      </div>
                      <div className='inline-flex items-center'>
                        <div className='flex-1 min-w-0'>
                          <select
                            id='department'
                            name='department'
                            className='bg-gray-50 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500'
                          >
                            <option value='select'>Select department</option>
                            {departments.map((department: any) => (
                              <option
                                key={department._id}
                                value={department._id}
                              >
                                {department.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </li>

                  <li className=''>
                    <div
                      className={`pt-2 w-full ` + (error ? 'block' : 'hidden')}
                    >
                      <p className='text-red-500'>{error}</p>
                    </div>
                    <div className='pt-4 flex justify-end'>
                      <button
                        type='submit'
                        className='inline-flex items-end p-2 text-sm font-medium text-center text-white bg-primary-600 rounded-lg focus:ring-4 focus:ring-reprimaryd-200 dark:focus:ring-primary-900 hover:bg-primary-700'
                      >
                        Create ticket
                      </button>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default NewTicket
