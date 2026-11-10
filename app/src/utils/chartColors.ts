// Tremor chartColors [v0.1.0]

export type ColorUtility = "bg" | "stroke" | "fill" | "text"

export const chartColors = {
  blue: {
    bg: "bg-blue",
    stroke: "stroke-blue",
    fill: "fill-blue",
    text: "text-blue",
  },
  emerald: {
    bg: "bg-dot-green",
    stroke: "stroke-dot-green",
    fill: "fill-dot-green",
    text: "text-dot-green",
  },
  violet: {
    bg: "bg-tag-research-fg",
    stroke: "stroke-tag-research-fg",
    fill: "fill-tag-research-fg",
    text: "text-tag-research-fg",
  },
  amber: {
    bg: "bg-dot-amber",
    stroke: "stroke-dot-amber",
    fill: "fill-dot-amber",
    text: "text-dot-amber",
  },
  gray: {
    bg: "bg-disabled",
    stroke: "stroke-disabled",
    fill: "fill-disabled",
    text: "text-disabled",
  },
  cyan: {
    bg: "bg-tag-mint-fg",
    stroke: "stroke-tag-mint-fg",
    fill: "fill-tag-mint-fg",
    text: "text-tag-mint-fg",
  },
  pink: {
    bg: "bg-tag-design-fg",
    stroke: "stroke-tag-design-fg",
    fill: "fill-tag-design-fg",
    text: "text-tag-design-fg",
  },
  lime: {
    bg: "bg-dot-clay",
    stroke: "stroke-dot-clay",
    fill: "fill-dot-clay",
    text: "text-dot-clay",
  },
  fuchsia: {
    bg: "bg-tag-dev-fg",
    stroke: "stroke-tag-dev-fg",
    fill: "fill-tag-dev-fg",
    text: "text-tag-dev-fg",
  },
} as const satisfies {
  [color: string]: {
    [key in ColorUtility]: string
  }
}

export type AvailableChartColorsKeys = keyof typeof chartColors

export const AvailableChartColors: AvailableChartColorsKeys[] = Object.keys(
  chartColors,
) as Array<AvailableChartColorsKeys>

export const constructCategoryColors = (
  categories: string[],
  colors: AvailableChartColorsKeys[],
): Map<string, AvailableChartColorsKeys> => {
  const categoryColors = new Map<string, AvailableChartColorsKeys>()
  categories.forEach((category, index) => {
    categoryColors.set(category, colors[index % colors.length])
  })
  return categoryColors
}

export const getColorClassName = (
  color: AvailableChartColorsKeys,
  type: ColorUtility,
): string => {
  const fallbackColor = {
    bg: "bg-disabled",
    stroke: "stroke-disabled",
    fill: "fill-disabled",
    text: "text-disabled",
  }
  return chartColors[color]?.[type] ?? fallbackColor[type]
}
