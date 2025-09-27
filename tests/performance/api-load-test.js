/**
 * UK Commission Admin Panel - API Performance Tests
 * k6 load testing script for backend API endpoints
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

// Custom metrics
export let errorRate = new Rate('errors');
export let responseTime = new Trend('response_time');

// Test configuration
export let options = {
  stages: [
    { duration: '2m', target: 10 }, // Ramp up
    { duration: '5m', target: 10 }, // Stay at 10 users
    { duration: '2m', target: 20 }, // Ramp up to 20 users
    { duration: '5m', target: 20 }, // Stay at 20 users
    { duration: '2m', target: 0 },  // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95% of requests must complete below 2s
    errors: ['rate<0.1'],              // Error rate must be below 10%
    http_reqs: ['rate>10'],            // Request rate should be above 10 RPS
  },
};

// Base configuration
const BASE_URL = __ENV.API_URL || 'http://localhost:8000';
const API_PREFIX = '/api/v1';

// Test data
const testCredentials = {
  username: 'test_user',
  password: 'TestPassword123!'
};

let authToken = '';

export function setup() {
  // Authenticate and get token for authenticated requests
  const loginPayload = JSON.stringify(testCredentials);
  const loginParams = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const loginResponse = http.post(`${BASE_URL}${API_PREFIX}/auth/login`, loginPayload, loginParams);

  if (loginResponse.status === 200) {
    const responseBody = JSON.parse(loginResponse.body);
    return { authToken: responseBody.access_token };
  }

  console.warn('Failed to authenticate for setup');
  return { authToken: '' };
}

export default function(data) {
  // Use token from setup
  const authHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${data.authToken}`,
  };

  // Test scenarios with different weights
  const scenarios = [
    { name: 'dashboard', weight: 30, func: testDashboard },
    { name: 'clients', weight: 25, func: testClients },
    { name: 'commissions', weight: 25, func: testCommissions },
    { name: 'users', weight: 10, func: testUsers },
    { name: 'analytics', weight: 10, func: testAnalytics },
  ];

  // Select scenario based on weight
  const random = Math.random() * 100;
  let cumulativeWeight = 0;
  let selectedScenario = scenarios[0];

  for (const scenario of scenarios) {
    cumulativeWeight += scenario.weight;
    if (random <= cumulativeWeight) {
      selectedScenario = scenario;
      break;
    }
  }

  // Execute selected scenario
  selectedScenario.func(authHeaders);

  // Think time between requests
  sleep(Math.random() * 3 + 1); // 1-4 seconds
}

function testDashboard(headers) {
  const group = 'Dashboard';

  // Test dashboard stats endpoint
  const statsResponse = http.get(`${BASE_URL}${API_PREFIX}/dashboard/stats`, { headers });

  const statsCheck = check(statsResponse, {
    [`${group} - Stats status is 200`]: (r) => r.status === 200,
    [`${group} - Stats response time < 1s`]: (r) => r.timings.duration < 1000,
    [`${group} - Stats has required fields`]: (r) => {
      const body = JSON.parse(r.body);
      return body.totalUsers !== undefined && body.totalClients !== undefined;
    },
  });

  errorRate.add(!statsCheck);
  responseTime.add(statsResponse.timings.duration);

  // Test recent activity
  const activityResponse = http.get(`${BASE_URL}${API_PREFIX}/dashboard/recent-activity`, { headers });

  check(activityResponse, {
    [`${group} - Activity status is 200`]: (r) => r.status === 200,
    [`${group} - Activity response time < 1s`]: (r) => r.timings.duration < 1000,
  });
}

function testClients(headers) {
  const group = 'Clients';

  // Test clients list with pagination
  const clientsResponse = http.get(`${BASE_URL}${API_PREFIX}/clients?page=1&page_size=20`, { headers });

  const clientsCheck = check(clientsResponse, {
    [`${group} - List status is 200`]: (r) => r.status === 200,
    [`${group} - List response time < 1s`]: (r) => r.timings.duration < 1000,
    [`${group} - List has pagination`]: (r) => {
      const body = JSON.parse(r.body);
      return Array.isArray(body.data) && body.total !== undefined;
    },
  });

  errorRate.add(!clientsCheck);
  responseTime.add(clientsResponse.timings.duration);

  // If we have clients, test getting a specific client
  if (clientsResponse.status === 200) {
    const clientsData = JSON.parse(clientsResponse.body);
    if (clientsData.data && clientsData.data.length > 0) {
      const clientId = clientsData.data[0].id;
      const clientDetailResponse = http.get(`${BASE_URL}${API_PREFIX}/clients/${clientId}`, { headers });

      check(clientDetailResponse, {
        [`${group} - Detail status is 200`]: (r) => r.status === 200,
        [`${group} - Detail response time < 0.5s`]: (r) => r.timings.duration < 500,
      });
    }
  }
}

function testCommissions(headers) {
  const group = 'Commissions';

  // Test commissions list
  const commissionsResponse = http.get(`${BASE_URL}${API_PREFIX}/commissions?page=1&page_size=20`, { headers });

  const commissionsCheck = check(commissionsResponse, {
    [`${group} - List status is 200`]: (r) => r.status === 200,
    [`${group} - List response time < 1s`]: (r) => r.timings.duration < 1000,
    [`${group} - List has valid structure`]: (r) => {
      const body = JSON.parse(r.body);
      return Array.isArray(body.data);
    },
  });

  errorRate.add(!commissionsCheck);
  responseTime.add(commissionsResponse.timings.duration);

  // Test commission statistics
  const statsResponse = http.get(`${BASE_URL}${API_PREFIX}/commissions/stats`, { headers });

  check(statsResponse, {
    [`${group} - Stats status is 200`]: (r) => r.status === 200,
    [`${group} - Stats response time < 1s`]: (r) => r.timings.duration < 1000,
  });

  // Test commission filters
  const filteredResponse = http.get(`${BASE_URL}${API_PREFIX}/commissions?status=pending`, { headers });

  check(filteredResponse, {
    [`${group} - Filtered status is 200`]: (r) => r.status === 200,
    [`${group} - Filtered response time < 1s`]: (r) => r.timings.duration < 1000,
  });
}

function testUsers(headers) {
  const group = 'Users';

  // Test current user profile
  const profileResponse = http.get(`${BASE_URL}${API_PREFIX}/users/me`, { headers });

  const profileCheck = check(profileResponse, {
    [`${group} - Profile status is 200`]: (r) => r.status === 200,
    [`${group} - Profile response time < 0.5s`]: (r) => r.timings.duration < 500,
    [`${group} - Profile has user data`]: (r) => {
      const body = JSON.parse(r.body);
      return body.username !== undefined;
    },
  });

  errorRate.add(!profileCheck);
  responseTime.add(profileResponse.timings.duration);

  // Test users list (if admin)
  const usersResponse = http.get(`${BASE_URL}${API_PREFIX}/users`, { headers });

  check(usersResponse, {
    [`${group} - List status is 200 or 403`]: (r) => r.status === 200 || r.status === 403,
    [`${group} - List response time < 1s`]: (r) => r.timings.duration < 1000,
  });
}

function testAnalytics(headers) {
  const group = 'Analytics';

  // Test analytics data
  const analyticsResponse = http.get(`${BASE_URL}${API_PREFIX}/analytics/summary`, { headers });

  const analyticsCheck = check(analyticsResponse, {
    [`${group} - Summary status is 200`]: (r) => r.status === 200,
    [`${group} - Summary response time < 2s`]: (r) => r.timings.duration < 2000,
  });

  errorRate.add(!analyticsCheck);
  responseTime.add(analyticsResponse.timings.duration);

  // Test performance metrics
  const performanceResponse = http.get(`${BASE_URL}${API_PREFIX}/analytics/performance`, { headers });

  check(performanceResponse, {
    [`${group} - Performance status is 200`]: (r) => r.status === 200,
    [`${group} - Performance response time < 2s`]: (r) => r.timings.duration < 2000,
  });
}

export function teardown(data) {
  // Logout if needed
  if (data.authToken) {
    const logoutHeaders = {
      'Authorization': `Bearer ${data.authToken}`,
    };

    http.post(`${BASE_URL}${API_PREFIX}/auth/logout`, '', { headers: logoutHeaders });
  }

  console.log('Performance test completed');
}

// Handle summary
export function handleSummary(data) {
  return {
    'api-performance-results.json': JSON.stringify(data),
    'stdout': textSummary(data, { indent: ' ', enableColors: true }),
  };
}

function textSummary(data, options) {
  // Custom summary formatting
  const indent = options.indent || '';
  const colors = options.enableColors || false;

  let output = '';

  output += `${indent}✓ Test completed successfully\n`;
  output += `${indent}  Scenarios executed: ${data.metrics.iterations.values.count}\n`;
  output += `${indent}  Average response time: ${Math.round(data.metrics.http_req_duration.values.avg)}ms\n`;
  output += `${indent}  95th percentile: ${Math.round(data.metrics.http_req_duration.values['p(95)']}ms\n`;
  output += `${indent}  Request rate: ${Math.round(data.metrics.http_reqs.values.rate * 100) / 100}/s\n`;
  output += `${indent}  Error rate: ${Math.round(data.metrics.errors.values.rate * 10000) / 100}%\n`;

  return output;
}
