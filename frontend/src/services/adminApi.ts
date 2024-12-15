import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_DOCKER_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Create an axios instance for admin API calls
const adminApi = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Add auth token to requests
adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token refresh
adminApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${API_URL}/api/users/token/refresh/`, {
            refresh: refreshToken
          });
          const { access } = response.data;
          localStorage.setItem('authToken', access);
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return adminApi(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/admin/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

export const adminAuthApi = {
  login: async ({ email, password }: { email: string; password: string }) => {
    try {
      // Get CSRF token from cookie that Django sets
      const response = await adminApi.post('/admin/auth/login/', {
        username: email,
        password,
      }, {
        headers: {
          'X-CSRFToken': document.cookie.split('; ')
            .find(row => row.startsWith('csrftoken='))
            ?.split('=')[1] || '',
        }
      });

      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  logout: async () => {
    try {
      await adminApi.post('/admin/auth/logout/', null, {
        headers: {
          'X-CSRFToken': document.cookie.split('; ')
            .find(row => row.startsWith('csrftoken='))
            ?.split('=')[1] || '',
        }
      });
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },

  checkAuth: async () => {
    try {
      const response = await adminApi.get('/admin/auth/check/');
      return response.data;
    } catch (error) {
      console.error('Auth check error:', error);
      throw error;
    }
  },
};

export const eventAdminApi = {
  // Event Management
  getEvents: async () => {
    const response = await adminApi.get('/events/events/');
    return response.data;
  },

  getEvent: async (id: string) => {
    const response = await adminApi.get(`/events/events/${id}/`);
    return response.data;
  },

  createEvent: async (eventData: FormData) => {
    const response = await adminApi.post('/events/events/', eventData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updateEvent: async (id: string, eventData: FormData) => {
    const response = await adminApi.patch(`/events/events/${id}/`, eventData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteEvent: async (id: string) => {
    await adminApi.delete(`/events/events/${id}/`);
  },

  // DJ Management
  getDJs: async () => {
    const response = await adminApi.get('/events/djs/');
    return response.data;
  },

  createDJ: async (djData: FormData) => {
    const response = await adminApi.post('/events/djs/', djData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export const userAdminApi = {
  // User Management
  getUsers: async () => {
    const response = await adminApi.get('/users/');
    return response.data;
  },

  getUser: async (id: string) => {
    const response = await adminApi.get(`/users/${id}/`);
    return response.data;
  },

  getUserProfile: async (id: string) => {
    const response = await adminApi.get(`/users/profiles/${id}/`);
    return response.data;
  },

  updateUserSettings: async (id: string, settings: any) => {
    const response = await adminApi.patch(`/users/settings/${id}/`, settings);
    return response.data;
  },
};

export const settingsApi = {
  // Settings Management
  getSettings: async () => {
    const response = await adminApi.get('/users/settings/me/');
    return response.data;
  },

  updateSettings: async (settings: any) => {
    const response = await adminApi.patch('/users/settings/update_me/', settings);
    return response.data;
  },
};

export const feedbackAdminApi = {
  // Feedback Management
  getFeedbacks: async () => {
    const response = await adminApi.get('/api/feedback/feedback/');
    return response.data;
  },

  getFeedback: async (id: string) => {
    const response = await adminApi.get(`/api/feedback/feedback/${id}/`);
    return response.data;
  },

  updateFeedbackStatus: async (id: string, status: string) => {
    const response = await adminApi.patch(`/api/feedback/feedback/${id}/update_status/`, { status });
    return response.data;
  },

  respondToFeedback: async (id: string, responseText: string) => {
    const response = await adminApi.post(`/api/feedback/feedback/${id}/respond/`, { 
      response: responseText 
    });
    return response.data;
  },

  deleteFeedback: async (id: string) => {
    await adminApi.delete(`/api/feedback/feedback/${id}/`);
  },

  // Survey Management
  getSurveys: async () => {
    const response = await adminApi.get('/surveys');
    return response.data;
  },

  getSurveyById: async (id: string) => {
    const response = await adminApi.get(`/surveys/${id}`);
    return response.data;
  },

  createSurvey: async (data: any) => {
    const response = await adminApi.post('/surveys', data);
    return response.data;
  },

  updateSurvey: async (id: string, data: any) => {
    const response = await adminApi.put(`/surveys/${id}`, data);
    return response.data;
  },

  deleteSurvey: async (id: string) => {
    const response = await adminApi.delete(`/surveys/${id}`);
    return response.data;
  },

  // Survey Responses
  getSurveyResponses: async (surveyId: string) => {
    const response = await adminApi.get(`/surveys/${surveyId}/responses`);
    return response.data;
  },

  exportSurveyResponses: async (surveyId: string) => {
    const response = await adminApi.get(`/surveys/${surveyId}/responses/export`, {
      responseType: 'blob'
    });
    return response.data;
  },
};
