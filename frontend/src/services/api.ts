import type { CreateQuizPayload, Quiz, QuizSummary } from '@/types/quiz';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${BASE_URL}${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...init?.headers,
      },
      cache: 'no-store',
    });
  } catch {
    throw new ApiError(`Can't reach the API at ${BASE_URL}. Is the backend running?`, 0);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const body = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      (body && typeof body.message === 'string' && body.message) ||
      `Request failed with status ${response.status}`;
    throw new ApiError(message, response.status);
  }

  return body as T;
}

export const quizzesApi = {
  list: () => request<QuizSummary[]>('/quizzes'),
  detail: (id: string) => request<Quiz>(`/quizzes/${id}`),
  create: (payload: CreateQuizPayload) =>
    request<Quiz>('/quizzes', { method: 'POST', body: JSON.stringify(payload) }),
  remove: (id: string) => request<void>(`/quizzes/${id}`, { method: 'DELETE' }),
};
