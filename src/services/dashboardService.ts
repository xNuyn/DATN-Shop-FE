// src/services/dashboardServices.ts
interface ChartItem {
  label: string;
  revenue: number;
  buyer_count: number;
}

interface DashboardResponse {
  total_revenue: number;
  total_users: number;
  total_orders: number;
  total_products: number;
  chart_data: ChartItem[];
}

/**
 * Gọi API Dashboard và trả về dữ liệu theo khoảng thời gian
 * @param time 'week' | 'month' | 'year'
 */
export const fetchDashboardData = async (time: 'week' | 'month' | 'year'): Promise<DashboardResponse> => {
  const token = localStorage.getItem('access_token');
  const res = await fetch(`http://127.0.0.1:8000/api/dashboard?time=${time}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  });
  if (!res.ok) throw new Error('Failed to fetch dashboard data');
  const data = await res.json();
  return data as DashboardResponse;
};
