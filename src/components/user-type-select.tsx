"use client"

import { useRef, useEffect } from "react"
import { ChevronDown } from "lucide-react"

interface UserTypeSelectProps {
  value: string
  onChange: (value: string) => void
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

export function UserTypeSelect({ value, onChange, isOpen, setIsOpen }: UserTypeSelectProps) {
  const dropdownRef = useRef<HTMLDivElement>(null)

  const userTypes = ["employee", "admin"]

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [setIsOpen])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        className="flex justify-between items-center w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{value}</span>
        <ChevronDown className="h-4 w-4 opacity-50" />
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full rounded-md border bg-white shadow-lg">
          <div className="p-1">
            {userTypes.map((type) => (
              <div
                key={type}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer rounded-md"
                onClick={() => {
                  onChange(type)
                  setIsOpen(false)
                }}
              >
                {type}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

