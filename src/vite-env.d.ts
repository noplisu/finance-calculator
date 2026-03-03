/// <reference types="vite/client" />

declare module "react" {
  export function useState<T>(initial: T | (() => T)): [T, (value: T | ((prev: T) => T)) => void]
  export function useMemo<T>(factory: () => T, deps: unknown[]): T
  export interface ChangeEvent<T = unknown> {
    target: T
  }
  const React: any
  export default React
}

declare module "*.css" {
  const classes: { readonly [key: string]: string }
  export default classes
}

declare module "recharts" {
  export const Bar: any
  export const BarChart: any
  export const CartesianGrid: any
  export const Line: any
  export const LineChart: any
  export const Tooltip: any
  export const XAxis: any
  export const YAxis: any
}
