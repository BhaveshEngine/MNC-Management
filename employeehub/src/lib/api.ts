const envUrl = (import.meta.env.VITE_API_URL as string | undefined)?.trim();
const API_BASE_URL = envUrl
  ? (envUrl.endsWith('/api') ? envUrl : `${envUrl.replace(/\/$/, '')}/api`)
  : (import.meta.env.PROD ? '/api' : 'http://localhost:8000/api');

export const api = {
  getRecords: async () => {
    const res = await fetch(`${API_BASE_URL}/records`);
    if (!res.ok) throw new Error('Failed to fetch records');
    return res.json();
  },
  addRecord: async (data: any) => {
    const res = await fetch(`${API_BASE_URL}/records`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to add record');
    return res.json();
  },
  deleteRecord: async (id: string) => {
    const res = await fetch(`${API_BASE_URL}/records/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete record');
    return res.json();
  },
  getAttendance: async () => {
    const res = await fetch(`${API_BASE_URL}/attendance`);
    if (!res.ok) throw new Error('Failed to fetch attendance');
    return res.json();
  },
  addAttendance: async (data: any) => {
    const res = await fetch(`${API_BASE_URL}/attendance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to add attendance');
    return res.json();
  },
  resetDemoData: async () => {
    const res = await fetch(`${API_BASE_URL}/reset`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!res.ok) throw new Error('Failed to reset demo data');
    return res.json();
  }
};
