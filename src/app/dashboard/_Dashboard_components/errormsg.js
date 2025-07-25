import React from 'react'

const ErrorMSg = ({err}) => {
  return (
     <div className="bg-gradient-to-br from-[#121212] via-[#232323] to-[#EA7A17] min-h-screen p-8 flex flex-col items-center justify-center flex items-center p-4 mb-4 text-sm text-yellow-800 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300" role="alert">
                {/* <svg class="shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                </svg> */}
                {/* <span class="sr-only">Info</span> */}
                <div>
                    <span className="font-medium">Error</span> {err}
                </div>
            </div>
  )
}

export default ErrorMSg