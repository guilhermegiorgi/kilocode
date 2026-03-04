import React from "react"
import { Icon } from "./Icon"

interface GGAIIconProps {
  size?: string
}

export function GGAIIcon({ size = "1.2em" }: GGAIIconProps) {
  return <Icon src="/docs/img/kilo-v1.svg" srcDark="/docs/img/kilo-v1-white.svg" alt="GG.AI Icon" size={size} />
}
