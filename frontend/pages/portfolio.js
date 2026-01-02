import { useEffect, useState } from 'react'
import api from '../lib/apiClient'
import TradeModal from '../components/TradeModal'
import PredictionCard from '../components/PredictionCard'
import PriceChart from '../components/PriceChart'
import LoadingSpinner from '../components/LoadingSpinner'
import toast from 'react-hot-toast'

export default function Portfolio() {
  const [holdings, setHoldings] = useState([])
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showTrade, setShowTrade] = useState(false)

  const fetchPortfolio = async () => {
    try {
      setLoading(true)
      const res = await api.get('/portfolio')
      setHoldings(res.data.holdings || [])
      setSummary(res.data.summary || null)
    } catch (error) {
      toast.error('Failed to fetch portfolio')
      console.error('Error fetching portfolio:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPortfolio()
  }, [])

  const handleDeleteHolding = async (id) => {
    if (!confirm('Are you sure you want to delete this holding?')) return
    
    try {
      await api.delete(`/portfolio/${id}`)
      toast.success('Holding deleted successfully')
      fetchPortfolio()
    } catch (error) {
      toast.error('Failed to delete holding')
      console.error('Error deleting holding:', error)
    }
  }

  if (loading) {
    return <LoadingSpinner text="Loading portfolio..." />
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">My Portfolio</h1>
        <button
          onClick={() => setShowTrade(true)}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Add Holding
        </button>
      </div>

      {/* Portfolio Summary */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600 mb-1">Total Invested</p>
            <p className="text-2xl font-bold text-gray-900">
              ${summary.totalInvested.toFixed(2)}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600 mb-1">Current Value</p>
            <p className="text-2xl font-bold text-gray-900">
              ${summary.totalCurrent.toFixed(2)}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600 mb-1">Total P&L</p>
            <p className={`text-2xl font-bold ${summary.totalProfitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${summary.totalProfitLoss.toFixed(2)}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600 mb-1">P&L %</p>
            <p className={`text-2xl font-bold ${summary.totalProfitLossPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {summary.totalProfitLossPercent}%
            </p>
          </div>
        </div>
      )}

      {/* Holdings Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        {holdings.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>No holdings yet. Start by adding your first stock!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symbol</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invested</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Value</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">P&L</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {holdings.map(holding => (
                  <tr key={holding.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{holding.symbol}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{holding.quantity}</td>
                    <td className="px-6 py-4 whitespace-nowrap">${parseFloat(holding.purchase_price).toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {holding.currentPrice ? `$${holding.currentPrice.toFixed(2)}` : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">${holding.investedValue.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {holding.currentValue ? `$${holding.currentValue.toFixed(2)}` : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {holding.profitLoss !== null ? (
                        <span className={holding.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}>
                          ${holding.profitLoss.toFixed(2)} ({holding.profitLossPercent}%)
                        </span>
                      ) : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleDeleteHolding(holding.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* AI Prediction Section */}
      {holdings.length > 0 && <PredictionCard />}

      {/* Trade Modal */}
      {showTrade && (
        <TradeModal 
          onClose={() => setShowTrade(false)} 
          onSuccess={() => {
            setShowTrade(false)
            fetchPortfolio()
          }}
        />
      )}
    </div>
  )
}

