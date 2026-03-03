/// <reference path="./vite-env.d.ts" />
/// <reference path="./react-jsx.d.ts" />
import React, { useMemo, useState } from "react"
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
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts"

const MONTHS_PER_YEAR = 12
const YEARS = 80

function compoundInterestByMonth(
  principal: number,
  monthlyPayment: number,
  annualRatePercent: number
): number[] {
  const monthlyRate = annualRatePercent / 100 / MONTHS_PER_YEAR
  const balances: number[] = [principal]
  for (let month = 1; month <= YEARS * MONTHS_PER_YEAR; month++) {
    const prev = balances[month - 1]
    balances[month] = prev * (1 + monthlyRate) + monthlyPayment
  }
  return balances
}

function App() {
  const [principal, setPrincipal] = useState("")
  const [monthlyPayment, setMonthlyPayment] = useState("")
  const [interestRate, setInterestRate] = useState("")

  const chartData = useMemo(() => {
    const p = parseFloat(principal) || 0
    const m = parseFloat(monthlyPayment) || 0
    const r = parseFloat(interestRate) || 0
    const balances = compoundInterestByMonth(p, m, r)
    return Array.from({ length: YEARS }, (_, i) => {
      const yearIndex = (i + 1) * MONTHS_PER_YEAR
      return {
        year: `Rok ${i + 1}`,
        kapitał: Math.round(balances[yearIndex] * 100) / 100,
      }
    })
  }, [principal, monthlyPayment, interestRate])

  const chartConfig = {
    kapitał: {
      label: "Kapitał (PLN)",
      color: "#2563eb",
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
              value={principal}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPrincipal(e.target.value)}
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
              value={monthlyPayment}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMonthlyPayment(e.target.value)}
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
              value={interestRate}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInterestRate(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <ChartContainer config={chartConfig} className="w-full" style={{ height: 300 }}>
        <LineChart accessibilityLayer data={chartData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="year" tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`} />
          <Line
            type="monotone"
            dataKey="kapitał"
            stroke="var(--color-kapitał)"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ChartContainer>
    </div>
  )
}

export default App
