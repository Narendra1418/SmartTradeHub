import '../styles/globals.css'
import Nav from '../components/Nav'
import ErrorBoundary from '../components/ErrorBoundary'
import { Toaster } from 'react-hot-toast'

export default function App({ Component, pageProps }) {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        <Nav />
        <main>
          <Component {...pageProps} />
        </main>
        <Toaster position="top-right" />
      </div>
    </ErrorBoundary>
  )
}

