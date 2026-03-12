import { createFileRoute } from '@tanstack/react-router'
import { PeriodicTable } from '../components/periodic-table'

export const Route = createFileRoute('/')({
  component: PeriodicTablePage,
})

function PeriodicTablePage() {
  return (
    <main className="page-wrap px-4 pb-8 pt-6">
      <header className="mb-8 text-center">
        <h1 className="display-title mb-2 text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Periodic Table of Elements
        </h1>
        <p className="text-white/70">
          Interactive periodic table with detailed element information
        </p>
      </header>
      <PeriodicTable />
    </main>
  )
}
