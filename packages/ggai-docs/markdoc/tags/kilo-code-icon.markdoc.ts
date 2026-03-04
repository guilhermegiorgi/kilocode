import { GGAIIcon } from "../../components"

export const kiloCodeIcon = {
  render: GGAIIcon,
  selfClosing: true,
  attributes: {
    size: {
      type: String,
      default: "1.2em",
      description: "Size of the icon (CSS height value)",
    },
  },
}
