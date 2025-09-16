"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const categories = [
  { id: "all", label: "All News", count: 156 },
  { id: "stocks", label: "Stocks", count: 45 },
  { id: "crypto", label: "Crypto", count: 32 },
  { id: "forex", label: "Forex", count: 28 },
  { id: "commodities", label: "Commodities", count: 19 },
  { id: "economics", label: "Economics", count: 23 },
  { id: "markets", label: "Markets", count: 41 },
  { id: "analysis", label: "Analysis", count: 15 },
]

interface CategoryFilterProps {
  selectedCategory: string
  onCategoryChange: (category: string) => void
}

export function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <Button
          key={category.id}
          variant={selectedCategory === category.id ? "default" : "outline"}
          size="sm"
          onClick={() => onCategoryChange(category.id)}
          className="relative"
        >
          {category.label}
          <Badge variant="secondary" className="ml-2 h-5 w-auto px-1.5 text-xs">
            {category.count}
          </Badge>
        </Button>
      ))}
    </div>
  )
}
