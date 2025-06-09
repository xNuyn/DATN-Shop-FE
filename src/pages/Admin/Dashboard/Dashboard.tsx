import React from 'react';
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

const stats = [
  {
    icon: <FaShoppingCart />,
    label: 'Total Orders',
    value: '13,647',
    change: '+2.3%',
    changeLabel: 'Last Week',
    trend: 'up'
  },
  {
    icon: <FaUserCheck />,
    label: 'New Leads',
    value: '9,526',
    change: '+8.1%',
    changeLabel: 'Last Month',
    trend: 'up'
  },
  {
    icon: <FaBriefcase />,
    label: 'Deals',
    value: '976',
    change: '–0.3%',
    changeLabel: 'Last Month',
    trend: 'down'
  },
  {
    icon: <FaDollarSign />,
    label: 'Booked Revenue',
    value: '$123.6k',
    change: '–10.6%',
    changeLabel: 'Last Month',
    trend: 'down'
  }
];

// sample monthly data
const data = [
  { month: 'Jan', pageViews: 33, clicks: 10 },
  { month: 'Feb', pageViews: 64, clicks: 12 },
  { month: 'Mar', pageViews: 46, clicks: 8 },
  { month: 'Apr', pageViews: 67, clicks: 15 },
  { month: 'May', pageViews: 48, clicks: 20 },
  { month: 'Jun', pageViews: 60, clicks: 13 },
  { month: 'Jul', pageViews: 40, clicks: 7 },
  { month: 'Aug', pageViews: 42, clicks: 9 },
  { month: 'Sep', pageViews: 78, clicks: 11 },
  { month: 'Oct', pageViews: 50, clicks: 25 },
  { month: 'Nov', pageViews: 62, clicks: 18 },
  { month: 'Dec', pageViews: 65, clicks: 30 }
];

const Dashboard: React.FC = () => {
  return (
    <div className="admin-layout">
      <DashboardAdmin />

      <div className="dashboard-page">
        <div className="alert-banner">
          <h3>WELCOM</h3>
        </div>

        <div className="stats-grid">
          {stats.map((s, idx) => (
            <div key={idx} className="stat-card">
              <div className="icon-box">{s.icon}</div>
              <div className="stat-content">
                <div className="stat-label">{s.label}</div>
                <div className="stat-value">{s.value}</div>
                <div className={`stat-change ${s.trend}`}>
                  {s.trend === 'up' ? '▲' : '▼'} {s.change}{' '}
                  <span className="change-label">{s.changeLabel}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="chart-container">
          <div className="chart-header">
            <h3>Performance</h3>
            <div className="chart-filters">
              <button className="active">ALL</button>
              <button>1M</button>
              <button>6M</button>
              <button>1Y</button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend verticalAlign="top" />
              <Bar dataKey="pageViews" name="Page Views" barSize={20} fill="#ff6b35" />
              <Line type="monotone" dataKey="clicks" name="Clicks" stroke="#1dd1a1" strokeWidth={2} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
