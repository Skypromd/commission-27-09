/**
 * UK Commission Admin Panel - Frontend Performance Tests
 * k6 load testing script for the main application page.
 */

import http from 'k6/http';
import { check, sleep } from 'k6';

// Test configuration
export let options = {
  stages: [
    { duration: '30s', target: 15 }, // Ramp up to 15 users
    { duration: '1m', target: 15 },  // Stay at 15 users for 1 minute
    { duration: '10s', target: 0 },  // Ramp down to 0
  ],
};

export default function () {
  // Replace with your frontend application's URL if different
  const res = http.get('http://localhost:3000');
  check(res, {
    'status was 200': (r) => r.status == 200,
    'text verification': (r) => r.body.includes('<div id="root"></div>'),
  });
  sleep(1);
}
