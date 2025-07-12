import React from "react"

function Toggle({ id, checked, onChange }) {
  return (
    <label htmlFor={id} className="inline-flex relative items-center cursor-pointer">
      <input
        type="checkbox"
        id={id}
        className="sr-only peer"
        checked={checked}
        onChange={onChange}
      />
      <div className="w-11 h-6 bg-gray-200 rounded-full peer-focus:ring-4 peer-focus:ring-primary-300 peer-checked:bg-primary-600 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white" />
    </label>
  )
}

export default Toggle