import { Review } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export async function createReview(review: {
  userId: string;
  itineraryId: number;
  content: string;
  rating: number;
}, token: string): Promise<Review> {
  const response = await fetch(`${API_URL}/api/review`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(review),
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Failed to create review');
  }

  return data;
}

export async function getReviewsByItineraryId(itineraryId: number): Promise<Review[]> {
  const response = await fetch(`${API_URL}/api/review/itinerary/${itineraryId}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch reviews');
  }
  
  return response.json();
}

export async function getReviewsByUserId(userId: string, token: string): Promise<Review[]> {
  const response = await fetch(`${API_URL}/api/review/user/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch user reviews');
  }
  
  return response.json();
}

export async function getReviewsForUserItineraries(userId: string): Promise<Review[]> {
  const response = await fetch(`${API_URL}/api/review/my-itineraries/${userId}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch reviews for user itineraries');
  }
  
  return response.json();
}

export async function getAverageRatingByItineraryId(itineraryId: number): Promise<number | null> {
  const response = await fetch(`${API_URL}/api/review/itinerary/${itineraryId}/average-rating`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch average rating');
  }
  
  const text = await response.text();
  if (!text || text.trim() === '') {
    return null;
  }
  
  return JSON.parse(text);
}