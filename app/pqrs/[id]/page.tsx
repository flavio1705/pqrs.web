import { Suspense } from 'react'
import Header from '@/app/components/Header'
import PQRSDetail from '@/app/components/PQRSDetail'
import Loading from '@/app/components/Loading'
import ErrorBoundary from '@/app/components/ErrorBoundary'

export default function PQRSDetailPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <ErrorBoundary fallback={<div>Error loading PQRS details</div>}>
          <Suspense fallback={<Loading />}>
            <PQRSDetail />
          </Suspense>
        </ErrorBoundary>
      </main>
    </div>
  )
}

