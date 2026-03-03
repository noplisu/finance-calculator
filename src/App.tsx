/// <reference path="./vite-env.d.ts" />
/// <reference path="./react-jsx.d.ts" />
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ChartContainer, type ChartConfig } from "@/components/ui/chart"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

function App() {

  const chartData = [
    { month: "January", desktop: 186, mobile: 80 },
    { month: "February", desktop: 305, mobile: 200 },
    { month: "March", desktop: 237, mobile: 120 },
    { month: "April", desktop: 73, mobile: 190 },
    { month: "May", desktop: 209, mobile: 130 },
    { month: "June", desktop: 214, mobile: 140 },
  ]

  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "#2563eb",
    },
    mobile: {
      label: "Mobile",
      color: "#60a5fa",
    },
  } satisfies ChartConfig

  return (
    <div className="mx-auto max-w-2xl space-y-8 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Kalkulator procentu składanego</CardTitle>
          <CardDescription>
            Wprowadź kwotę początkową, miesięczną wpłatę oraz stopę procentową, aby zobaczyć prognozę.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="principal">Kwota początkowa (PLN)</Label>
            <Input
              id="principal"
              type="number"
              placeholder="0"
              min={0}
              step="any"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="monthly-payment">Wpłata miesięczna (PLN)</Label>
            <Input
              id="monthly-payment"
              type="number"
              placeholder="0"
              min={0}
              step="any"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="interest-rate">Stopa procentowa (%)</Label>
            <Input
              id="interest-rate"
              type="number"
              placeholder="0"
              min={0}
              max={100}
              step="0.01"
            />
          </div>
        </CardContent>
      </Card>

      <ChartContainer config={chartConfig} className="w-full" style={{ height: 300 }}>
        <BarChart accessibilityLayer data={chartData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="month" tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} />
          <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
          <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
        </BarChart>
      </ChartContainer>
    </div>
  )
}

export default App
