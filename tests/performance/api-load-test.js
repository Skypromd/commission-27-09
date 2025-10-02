/**
 * UK Commission Admin Panel - API Performance Tests
 * k6 load testing script for backend API endpoints
 */

import http from 'k6/http';
import { check, sleep } from 'k6';

// Test configuration
export let options = {
  stages: [
    { duration: '30s', target: 20 }, // Ramp up to 20 users
    { duration: '1m', target: 20 },  // Stay at 20 users for 1 minute
    { duration: '10s', target: 0 },  // Ramp down to 0
  ],
};

export default function () {
  // Replace with your real endpoint
  const res = http.get('http://localhost:8000/articles');
  check(res, { 'status was 200': (r) => r.status == 200 });
  sleep(1);
}
