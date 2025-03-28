import { ReactNode } from "react"
import {
  Boxes,
  Car,
  House,
  WashingMachine,
  BriefcaseBusiness,
  HeartHandshake,
  Handshake,
  CircleHelp,
} from "lucide-react"

const categories = [
  {
    id: 15,
    title: "Auto-Moto",
    icon: Car,
  },
  {
    id: 16,
    title: "Diverse",
    icon: Boxes,
  },
  {
    id: 17,
    title: "Electronice/electrocasnice",
    icon: WashingMachine,
  },
  {
    id: 19,
    title: "Imobiliare",
    icon: House,
  },
  {
    id: 20,
    title: "Locuri de muncă",
    icon: BriefcaseBusiness,
  },
  {
    id: 21,
    title: "Matrimoniale",
    icon: HeartHandshake,
  },
  {
    id: 22,
    title: "Pierderi",
    icon: CircleHelp,
  },
  {
    id: 23,
    title: "Servicii",
    icon: Handshake,
  },
]

import { ComponentType } from "react"
import { LucideIcon, LucideProps } from "lucide-react"

const CategoryIcon = ({
  categoryId,
  ...rest
}: { categoryId: number } & Partial<LucideProps>): ReactNode => {
  const category = categories.find((i) => i.id === categoryId)
  if (category) {
    const IconComponent = category.icon as ComponentType<LucideProps>
    return <IconComponent {...rest} />
  }
  //TODO return a default icon
  return null
}
export default CategoryIcon
