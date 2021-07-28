import React from 'react'
import Image from 'next/image'

const DigitalAssetCard = () => {
  return (
    <div className="flex shadow">
      <div className="flex-none sm:w-28 lg:w-44 relative">
        <Image src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2850&q=80" alt="" layout="fill" className="absolute inset-0 w-full h-full object-cover" />
      </div>
      <form className="flex-auto px-4 py-6">
        <div className="flex flex-wrap">
          <h1 className="flex-auto text-xl font-semibold">
            Classic Utility Jacket
          </h1>
          <div className="text-xl font-semibold text-gray-500">
            $110.00
          </div>
        </div>
        <div className="flex items-baseline mt-4 mb-6">
        <p className="text-sm text-gray-500">
          Free shipping on all continental US orders.
        </p>
        </div>
        <div className="flex space-x-3 mb-4 text-sm font-medium">
          <div className="flex-auto flex space-x-3">
            <button className="w-3/4 flex items-center justify-center rounded-md bg-indigo-700 text-white" type="submit">Buy now</button>
          </div>
          <button className="flex-none flex items-center justify-center w-9 h-9 rounded-md text-gray-400 border border-gray-300" type="button" aria-label="like">
            <svg width="20" height="20" fill="currentColor">
              <path fillRule="evenodd" clipRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
            </svg>
          </button>
        </div>
      </form>
    </div>

  )
}

export default DigitalAssetCard
