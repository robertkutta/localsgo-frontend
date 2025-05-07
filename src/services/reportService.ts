import { Report } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

// Helper function to handle API requests
async function apiRequest<T>(
  endpoint: string, 
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, options);
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }
  
  return data;
}

export async function createReport(
  report: {
    userId: string;
    itineraryId: number;
    details?: string;
    reason: string;
  }, 
  token: string
): Promise<Report> {
  return apiRequest<Report>('/api/report', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(report),
  });
}

export async function getReportsByItineraryId(itineraryId: number): Promise<Report[]> {
  return apiRequest<Report[]>(`/api/report/itinerary/${itineraryId}`);
}
