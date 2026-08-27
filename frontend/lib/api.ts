export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export const fetchApi = async (endpoint: string, options: RequestInit = {}) => {
  const isFormData = options.body instanceof FormData;
  const headers: HeadersInit = {
    ...(!isFormData && { "Content-Type": "application/json" }),
    ...options.headers,
  };

  const mergedOptions: RequestInit = {
    ...options,
    credentials: "include",
    headers,
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, mergedOptions);
    if (response.status === 401 && endpoint !== "/auth/me") {
      if (
        typeof window !== "undefined" &&
        !window.location.pathname.includes("/login")
      ) {
        console.warn(
          "Session expired or unauthorized. Redirecting to login...",
        );
        window.location.href = "/login";
      }
    }

    return response;
  } catch (error) {
    console.error("Fetch API Error:", error);
    throw error;
  }
};

export const api = {
  get: (endpoint: string, options?: RequestInit) =>
    fetchApi(endpoint, { ...options, method: "GET" }),

  post: (endpoint: string, data?: any, options?: RequestInit) =>
    fetchApi(endpoint, {
      ...options,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    }),

  put: (endpoint: string, data?: any, options?: RequestInit) =>
    fetchApi(endpoint, {
      ...options,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    }),

  patch: (endpoint: string, data?: any, options?: RequestInit) =>
    fetchApi(endpoint, {
      ...options,
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    }),

  delete: (endpoint: string, options?: RequestInit) =>
    fetchApi(endpoint, { ...options, method: "DELETE" }),
};
