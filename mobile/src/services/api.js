import axios from 'axios';
import { Platform } from 'react-native';

// In Android Emulator, localhost is 10.0.2.2. In iOS Simulator, it is localhost.
// On physical devices, replace with your development machine's local Wi-Fi IP (e.g. http://192.168.1.5:5000/api)
export const API_BASE_URL = Platform.select({
  android: 'http://10.0.2.2:5000/api',
  ios: 'http://localhost:5000/api',
  default: 'http://localhost:5000/api'
});

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 12000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

export default apiClient;
