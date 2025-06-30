"use client"

import * as React from "react"
import { MoonIcon, SunIcon, ComputerDesktopIcon } from "@heroicons/react/24/outline"
import { useTheme } from "./theme-provider"
import { Button } from "./ui/button"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark")
    } else if (theme === "dark") {
      setTheme("system")
    } else {
      setTheme("light")
    }
  }

  const getIcon = () => {
    switch (theme) {
      case "light":
        return <SunIcon className="h-4 w-4" />
      case "dark":
        return <MoonIcon className="h-4 w-4" />
      case "system":
        return <ComputerDesktopIcon className="h-4 w-4" />
      default:
        return <ComputerDesktopIcon className="h-4 w-4" />
    }
  }

  const getLabel = () => {
    switch (theme) {
      case "light":
        return "Light mode"
      case "dark":
        return "Dark mode"
      case "system":
        return "System theme"
      default:
        return "System theme"
    }
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "light" ? "dark" : theme === "dark" ? "system" : "light"} mode`}
      title={getLabel()}
      className="h-9 w-9"
    >
      {getIcon()}
      <span className="sr-only">{getLabel()}</span>
    </Button>
  )
}
