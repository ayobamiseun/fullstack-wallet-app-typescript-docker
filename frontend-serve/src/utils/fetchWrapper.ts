import { toast } from "react-toastify";

interface RequestOptions {
  method: string;
  headers: Record<string, string>;
  body?: string;
}

const fetchWrapper = {
  post,
  get,
  put,
  del,
};

let hasLoggedFirstResponse = false;

async function request(
  method: string,
  url: string,
  body: any = null,
  token?: string
): Promise<any> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token && { authorization: `Bearer ${token}` }),
  };

  const requestOptions: RequestOptions = {
    method,
    headers,
    ...(body && { body: JSON.stringify(body) }),
  };

  try {
    const response = await fetch(url, requestOptions);
    const contentType = response.headers.get("content-type");
    const isJson = contentType?.includes("application/json");
    const data = isJson ? await response.json() : null;

    // ✅ Log the first successful response (parsed JSON)
    if (response.ok && !hasLoggedFirstResponse) {
      console.log(`[${method}] ${url} ➜ First Response JSON:`, data);
      hasLoggedFirstResponse = true;
    }

    if (!response.ok) {
      const message = getErrorMessage(response.status, data?.message);
      showToast(message);
      throw new Error(message);
    }

    return data;
  } catch (error: any) {
    console.error(`[${method}] ${url} error:`, error.message);
    showToast(error.message || "Something went wrong, please try again.");
    throw error;
  }
}

function post(url: string, body: any, token?: string) {
  return request("POST", url, body, token);
}

function put(url: string, body: any, token?: string) {
  return request("PUT", url, body, token);
}

function get(url: string, token?: string) {
  return request("GET", url, null, token);
}

function del(url: string, body: any, token?: string) {
  return request("DELETE", url, body, token);
}

function showToast(message: string) {
  toast.error(message, {
    position: "top-right",
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
}

function getErrorMessage(status: number, serverMessage?: string) {
  const defaultMessages: Record<number, string> = {
    400: "Bad request. Please check the data you submitted.",
    401: "Unauthorized. Please login again.",
    403: "Forbidden. You do not have access.",
    404: "Not found. The requested resource could not be located.",
    409: "Conflict. This request conflicts with existing data.",
    422: "Validation error. Please fix the issues and try again.",
    500: "Internal server error. Please try again later.",
    503: "Service unavailable. Please try again shortly.",
  };

  return (
    serverMessage || defaultMessages[status] || `Unexpected error (status ${status}).`
  );
}

export default fetchWrapper;
