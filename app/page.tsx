'use client'

import { useState, useEffect } from 'react'
import Header from './components/Header'
import { Dashboard } from './components/Dashboard'
import PQRSList from './components/PQRSList'
import Loading from './components/Loading'
import ErrorBoundary from './components/ErrorBoundary'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from 'lucide-react'
import { useNotifications } from '@/lib/firebase'

async function fetchPQRSData() {
  const res = await fetch('https://l0w2wr04-3000.brs.devtunnels.ms/pqrs', { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch PQRS data');
  }
  return res.json();
}

export default function Home() {
  const [pqrsData, setPQRSData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { notification, token, isSubscribed } = useNotifications();

  const updatePQRSData = async () => {
    setLoading(true);
    try {
      const newData = await fetchPQRSData();
      setPQRSData(newData);
    } catch (error) {
      console.error('Error fetching PQRS data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    updatePQRSData();
  }, []);

  useEffect(() => {
    if (isSubscribed && token) {
      console.log('FCM Token:', token);
    }
  }, [isSubscribed, token]);

  useEffect(() => {
    if (notification) {
      console.log('Nueva notificación:', notification);
      updatePQRSData();
    }
  }, [notification]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4 text-gray-800">Welcome to PQRS Management System</h1>
          <p className="text-xl text-gray-600 mb-6">Efficiently manage and track Petitions, Complaints, Claims, and Suggestions</p>
          {/* <Button className="bg-blue-600 hover:bg-blue-700">
            Create New PQRS
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button> */}
        </section>

        {/* Dashboard Section */}
        <section className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-800">Dashboard Overview</CardTitle>
              <CardDescription>Key metrics and statistics of your PQRS system</CardDescription>
            </CardHeader>
            <CardContent>
              <ErrorBoundary fallback={<div className="text-red-500">Error loading dashboard</div>}>
                <Dashboard data={pqrsData} />
              </ErrorBoundary>
            </CardContent>
          </Card>
        </section>

        {/* PQRS List Section */}
        <section>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-800">Recent PQRS</CardTitle>
              <CardDescription>Latest submissions and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <ErrorBoundary fallback={<div className="text-red-500">Error loading PQRS list</div>}>
                <PQRSList data={pqrsData} />
              </ErrorBoundary>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  )
}