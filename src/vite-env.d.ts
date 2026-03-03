/// <reference types="vite/client" />

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
  export const XAxis: any
  export const YAxis: any
}
