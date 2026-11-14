import axios from 'axios';
import { Platform } from 'react-native';

// In Android Emulator, localhost is 10.0.2.2.
// On physical devices using Expo Go on Wi-Fi, use the machine's LAN IP.
const HOST_IP = '172.18.22.28';

export const API_BASE_URL = Platform.select({
  android: `http://${HOST_IP}:5000/api`,
  ios: `http://${HOST_IP}:5000/api`,
  default: `http://localhost:5000/api`
});

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

export default apiClient;
