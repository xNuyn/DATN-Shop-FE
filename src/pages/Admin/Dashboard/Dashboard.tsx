import React, { useState, useEffect } from 'react';
import './Dashboard.scss';
import DashboardAdmin from '../../../components/DashboardAdmin/DashboardAdmin';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { FaShoppingCart, FaUserCheck, FaBriefcase, FaDollarSign } from 'react-icons/fa';
import { fetchDashboardData } from '../../../services/dashboardService';

const filterOptions = [
  { label: '1W', value: 'week' },
  { label: '1M', value: 'month' },
  { label: '1Y', value: 'year' }
];

interface ChartDataItem {
  date: string;
  revenue: number;
  buyers: number;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    total_revenue: 0,
    total_users: 0,
    total_orders: 0,
    total_products: 0
  });
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [activeFilter, setActiveFilter] = useState<'week' | 'month' | 'year'>('week');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await fetchDashboardData(activeFilter);
        setStats({
          total_revenue: data.total_revenue,
          total_users: data.total_users,
          total_orders: data.total_orders,
          total_products: data.total_products
        });
        const formatted = data.chart_data.map(item => ({
          date: item.label,
          revenue: item.revenue,
          buyers: item.buyer_count
        }));
        setChartData(formatted);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [activeFilter]);

  const statsDisplay = [
    {
      icon: <FaShoppingCart />,
      label: 'Total Orders',
      value: stats.total_orders.toLocaleString(),
      trend: 'up'
    },
    {
      icon: <FaUserCheck />,
      label: 'Total Users',
      value: stats.total_users.toLocaleString(),
      trend: 'up'
    },
    {
      icon: <FaBriefcase />,
      label: 'Total Products',
      value: stats.total_products.toLocaleString(),
      trend: 'up'
    },
    {
      icon: <FaDollarSign />,
      label: 'Total Revenue',
      value: `${stats.total_revenue.toLocaleString('vi-VN')} ₫`,
      trend: 'up'
    }
  ];

  return (
    <div className="admin-layout">
      <DashboardAdmin />

      <div className="dashboard-page">
        <div className="alert-banner">
          <h3>WELCOME</h3>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <div className="stats-grid">
              {statsDisplay.map((s, idx) => (
                <div key={idx} className="stat-card">
                  <div className="icon-box">{s.icon}</div>
                  <div className="stat-content">
                    <div className="stat-label">{s.label}</div>
                    <div className="stat-value">{s.value}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="chart-container">
              <div className="chart-header">
                <h3>Performance</h3>
                <div className="chart-filters">
                  {filterOptions.map(option => (
                    <button
                      key={option.value}
                      className={option.value === activeFilter ? 'active' : ''}
                      onClick={() => setActiveFilter(option.value as 'week' | 'month' | 'year')}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart
                  data={chartData}
                  margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />

                  {/* YAxis cho revenue (bên trái) */}
                  <YAxis
                    yAxisId="left"
                    tickFormatter={(value) => `${value.toLocaleString('vi-VN')} ₫`}
                    tick={{ fontSize: 12 }}
                  />

                  {/* YAxis cho buyers (bên phải) */}
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tickFormatter={(value) => `${value} người`}
                    tick={{ fontSize: 12 }}
                    domain={[0, 'dataMax']}
                    allowDecimals={false}
                  />

                  <Tooltip />
                  <Legend verticalAlign="top" />

                  {/* Bar sử dụng yAxisId bên trái */}
                  <Bar
                    yAxisId="left"
                    dataKey="revenue"
                    name="Doanh thu"
                    barSize={20}
                    fill="#ff6b35"
                  />

                  {/* Line sử dụng yAxisId bên phải */}
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="buyers"
                    name="Người mua"
                    stroke="#1dd1a1"
                    strokeWidth={2}
                  />
                </ComposedChart>
              </ResponsiveContainer>

            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
