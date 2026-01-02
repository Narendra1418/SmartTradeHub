import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">SmartTradeHub</h1>
      <Link href="/dashboard" className="mt-6 text-blue-400">
        Go to Dashboard →
      </Link>
    </div>
  )
}
