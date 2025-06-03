"use client"

import { useState } from "react"
import { FaInfoCircle, FaCheckCircle, FaExclamationTriangle, FaTimesCircle, FaTimes } from "react-icons/fa"

function Alert({ children, type = "info", dismissible = false, className = "" }) {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  const typeClasses = {
    info: "bg-blue-50 text-blue-800 border-blue-200",
    success: "bg-green-50 text-green-800 border-green-200",
    warning: "bg-yellow-50 text-yellow-800 border-yellow-200",
    error: "bg-red-50 text-red-800 border-red-200",
  }

  const icons = {
    info: <FaInfoCircle className="text-blue-500" />,
    success: <FaCheckCircle className="text-green-500" />,
    warning: <FaExclamationTriangle className="text-yellow-500" />,
    error: <FaTimesCircle className="text-red-500" />,
  }

  return (
    <div
      className={`flex items-center p-4 border rounded-md ${typeClasses[type]} ${className}`}
      role="alert"
      aria-live="assertive"
    >
      <div className="flex-shrink-0 mr-3">{icons[type]}</div>
      <div className="flex-grow">{children}</div>
      {dismissible && (
        <button
          className="flex-shrink-0 ml-3 focus:outline-none"
          onClick={() => setIsVisible(false)}
          aria-label="Close"
        >
          <FaTimes />
        </button>
      )}
    </div>
  )
}

export default Alert
