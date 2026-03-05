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
const MAX_PRINCIPAL = 1_000_000_000
const MAX_MONTHLY_PAYMENT = 1_000_000
const MAX_INTEREST_RATE = 20
const MAX_YEARS = 100
const MIN_YEARS = 1

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
    const p = Math.min(MAX_PRINCIPAL, Math.max(0, parseFloat(principal) || 0))
    const m = Math.min(MAX_MONTHLY_PAYMENT, Math.max(0, parseFloat(monthlyPayment) || 0))
    const r = Math.min(MAX_INTEREST_RATE, Math.max(0, parseFloat(interestRate) || 0))
    const y = Math.min(MAX_YEARS, Math.max(MIN_YEARS, Math.floor(parseFloat(years) || 30)))
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

  const lastPoint = chartData[chartData.length - 1]
  const finalBalance: number = lastPoint ? lastPoint.kapitał : 0
  const hasInputs = [principal, monthlyPayment, interestRate].some((v: string) => v.trim() !== "")
  const yearsNum = Math.min(MAX_YEARS, Math.max(MIN_YEARS, Math.floor(parseFloat(years) || 30)))
  const xAxisStepYears = Math.ceil(Math.log2(yearsNum) + 1)
  const xAxisInterval = xAxisStepYears * MONTHS_PER_YEAR - 1
  const totalInvested: number =
    Math.min(MAX_PRINCIPAL, Math.max(0, parseFloat(principal) || 0)) +
    Math.min(MAX_MONTHLY_PAYMENT, Math.max(0, parseFloat(monthlyPayment) || 0)) * yearsNum * MONTHS_PER_YEAR
  const growth: number =
    finalBalance > 0 && totalInvested > 0 ? ((finalBalance - totalInvested) / totalInvested) * 100 : 0

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
      {/* Hero */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="mx-auto max-w-4xl px-4 py-10 text-center sm:px-6 sm:py-14">
          <p className="mb-2 text-sm font-medium uppercase tracking-wider text-primary">
            Darmowy kalkulator
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            Zobacz, jak <span className="text-primary">procent składany</span> rośnie w czasie
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            Wprowadź dane poniżej i od razu zobaczysz prognozę kapitału na kolejne miesiące i lata — bez logowania, za darmo.
          </p>
          <ul className="mx-auto mt-6 flex flex-wrap justify-center gap-x-6 gap-y-1 text-sm text-muted-foreground">
            <li>✓ Bez rejestracji</li>
            <li>✓ Dane tylko u Ciebie</li>
            <li>✓ Wynik od razu</li>
          </ul>
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="grid min-w-0 grid-cols-1 gap-8 lg:grid-cols-[340px_1fr] lg:gap-10">
          {/* Calculator card */}
          <Card className="h-fit border-2 border-primary/20 shadow-lg lg:sticky lg:top-8">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl">Twoja prognoza</CardTitle>
              <CardDescription>
                Uzupełnij pola — wykres zaktualizuje się na żywo.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="principal">Kwota początkowa (PLN)</Label>
                <Input
                  id="principal"
                  type="number"
                  placeholder="np. 10000"
                  min={0}
                  max={MAX_PRINCIPAL}
                  step="any"
                  value={principal}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  const v = e.target.value
                  if (v === "" || v === "-") {
                    setPrincipal(v)
                    return
                  }
                  const n = parseFloat(v)
                  if (!Number.isFinite(n)) return
                  if (n < 0) setPrincipal("0")
                  else if (n > MAX_PRINCIPAL) setPrincipal(String(MAX_PRINCIPAL))
                  else setPrincipal(v)
                }}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="monthly-payment">Wpłata miesięczna (PLN)</Label>
                <Input
                  id="monthly-payment"
                  type="number"
                  placeholder="np. 500"
                  min={0}
                  max={MAX_MONTHLY_PAYMENT}
                  step="any"
                  value={monthlyPayment}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  const v = e.target.value
                  if (v === "" || v === "-") {
                    setMonthlyPayment(v)
                    return
                  }
                  const n = parseFloat(v)
                  if (!Number.isFinite(n)) return
                  if (n < 0) setMonthlyPayment("0")
                  else if (n > MAX_MONTHLY_PAYMENT) setMonthlyPayment(String(MAX_MONTHLY_PAYMENT))
                  else setMonthlyPayment(v)
                }}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="interest-rate">Stopa procentowa (%)</Label>
                <Input
                  id="interest-rate"
                  type="number"
                  placeholder="np. 5"
                  min={0}
                  max={MAX_INTEREST_RATE}
                  step="0.01"
                  value={interestRate}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  const v = e.target.value
                  if (v === "" || v === "-") {
                    setInterestRate(v)
                    return
                  }
                  const n = parseFloat(v)
                  if (!Number.isFinite(n)) return
                  if (n < 0) setInterestRate("0")
                  else if (n > MAX_INTEREST_RATE) setInterestRate(String(MAX_INTEREST_RATE))
                  else setInterestRate(v)
                }}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="years">Okres (lata)</Label>
                <Input
                  id="years"
                  type="number"
                  placeholder="30"
                  min={MIN_YEARS}
                  max={MAX_YEARS}
                  step={1}
                  value={years}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  const v = e.target.value
                  if (v === "") {
                    setYears(v)
                    return
                  }
                  const n = parseInt(v, 10)
                  if (!Number.isFinite(n)) return
                  if (n < MIN_YEARS) setYears(String(MIN_YEARS))
                  else if (n > MAX_YEARS) setYears(String(MAX_YEARS))
                  else setYears(v)
                }}
                />
              </div>

              {hasInputs && finalBalance > 0 && (
                <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Szacowany kapitał na koniec okresu
                  </p>
                  <p className="mt-1 text-2xl font-bold text-primary">
                    {finalBalance.toLocaleString("pl-PL", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} PLN
                  </p>
                  {growth > 0 && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      Zysk z odsetek: +{growth.toFixed(1)}% względem wpłat
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Chart + copy */}
          <div className="min-w-0 space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Wzrost kapitału w czasie</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Każdy punkt to koniec miesiąca. Najedź kursorem, żeby zobaczyć dokładną wartość.
              </p>
            </div>
            <Card className="overflow-hidden">
              <CardContent className="p-4 sm:p-6">
                <ChartContainer config={chartConfig} className="min-h-[280px] w-full min-w-0 sm:min-h-[320px]" style={{ height: "clamp(280px, 50vmin, 320px)" }}>
                  <LineChart accessibilityLayer data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="month"
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(month: number) => String(Math.ceil(month / MONTHS_PER_YEAR))}
                      interval={xAxisInterval}
                      angle={yearsNum > 20 ? -45 : 0}
                      textAnchor={yearsNum > 20 ? "end" : "middle"}
                      tick={{ fontSize: yearsNum > 40 ? 10 : undefined }}
                    />
                    <YAxis tickLine={false} axisLine={false} tickFormatter={(v: number) => `${v.toLocaleString("pl-PL", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`} />
                    <Tooltip
                      contentStyle={{ borderRadius: "8px", border: "1px solid var(--border)" }}
                      formatter={(value: number) => [
                        `${value.toLocaleString("pl-PL", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} PLN`,
                        "Kapitał",
                      ]}
                      labelFormatter={(_: unknown, payload: { payload?: { monthLabel?: string } }[]) =>
                        payload[0]?.payload?.monthLabel ?? ""
                      }
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
              </CardContent>
            </Card>
            <p className="text-center text-sm text-muted-foreground">
              Wyniki mają charakter poglądowy. Rzeczywista stopa zwrotu może się różnić.
            </p>
          </div>
        </div>
      </main>

      <footer className="border-t border-border/50 py-6 text-center text-sm text-muted-foreground">
        Zbudowano z myślą o planowaniu oszczędności. Użyj mądrze. 🚀
      </footer>
    </div>
  )
}

export default App
