/// <reference path="./vite-env.d.ts" />
/// <reference path="./react-jsx.d.ts" />
import { useMemo, useState, type ChangeEvent } from "react"
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
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

const MONTHS_PER_YEAR = 12

function compoundInterestByMonth(
  principal: number,
  monthlyPayment: number,
  annualRatePercent: number,
  years: number
): number[] {
  const totalMonths = years * MONTHS_PER_YEAR
  const monthlyRate = annualRatePercent / 100 / MONTHS_PER_YEAR
  const balances: number[] = [principal]
  for (let month = 1; month <= totalMonths; month++) {
    const prev = balances[month - 1]
    balances[month] = prev * (1 + monthlyRate) + monthlyPayment
  }
  return balances
}

function App() {
  const [principal, setPrincipal] = useState("")
  const [monthlyPayment, setMonthlyPayment] = useState("")
  const [interestRate, setInterestRate] = useState("")
  const [years, setYears] = useState("30")

  const chartData = useMemo(() => {
    const p = parseFloat(principal) || 0
    const m = parseFloat(monthlyPayment) || 0
    const r = parseFloat(interestRate) || 0
    const y = Math.min(80, Math.max(1, Math.floor(parseFloat(years) || 30)))
    const balances = compoundInterestByMonth(p, m, r, y)
    const totalMonths = y * MONTHS_PER_YEAR
    return Array.from({ length: totalMonths }, (_, i) => {
      const monthIndex = i + 1
      const yearNum = Math.floor(i / MONTHS_PER_YEAR) + 1
      const monthNum = (i % MONTHS_PER_YEAR) + 1
      return {
        month: monthIndex,
        monthLabel: `Rok ${yearNum}, miesiąc ${monthNum}`,
        kapitał: Math.round(balances[monthIndex] * 100) / 100,
      }
    })
  }, [principal, monthlyPayment, interestRate, years])

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
            Wprowadź kwotę początkową, miesięczną wpłatę, stopę procentową oraz okres, aby zobaczyć prognozę.
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
              onChange={(e: ChangeEvent<HTMLInputElement>) => setPrincipal(e.target.value)}
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
              onChange={(e: ChangeEvent<HTMLInputElement>) => setMonthlyPayment(e.target.value)}
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
              onChange={(e: ChangeEvent<HTMLInputElement>) => setInterestRate(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="years">Okres (lata)</Label>
            <Input
              id="years"
              type="number"
              placeholder="30"
              min={1}
              max={80}
              step={1}
              value={years}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setYears(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <ChartContainer config={chartConfig} className="w-full" style={{ height: 300 }}>
        <LineChart accessibilityLayer data={chartData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickFormatter={ (month: number) => (Math.ceil(month / MONTHS_PER_YEAR)) }
            interval={MONTHS_PER_YEAR - 1}
          />
          <YAxis tickLine={false} axisLine={false} tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`} />
          <Tooltip
            contentStyle={{ borderRadius: "8px", border: "1px solid var(--border)" }}
            formatter={(value: number) => [`${value.toLocaleString("pl-PL", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} PLN`, "Kapitał"]}
            labelFormatter={(_: unknown, payload: { payload?: { monthLabel?: string } }[]) => payload[0]?.payload?.monthLabel ?? ""}
          />
          <Line
            type="monotone"
            dataKey="kapitał"
            stroke="var(--color-kapitał)"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ChartContainer>
    </div>
  )
}

export default App
