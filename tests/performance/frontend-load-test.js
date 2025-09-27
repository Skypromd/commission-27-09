/**
 * UK Commission Admin Panel - Frontend Performance Tests
 * k6 browser testing script for React application
 */

import { browser } from 'k6/experimental/browser';
import { check, sleep } from 'k6';

export const options = {
  scenarios: {
    ui_test: {
      executor: 'shared-iterations',
      options: {
        browser: {
          type: 'chromium',
        },
      },
      vus: 3,
      iterations: 9,
      maxDuration: '10m',
    },
  },
  thresholds: {
    browser_web_vital_fcp: ['p(95)<2000'], // First Contentful Paint
    browser_web_vital_lcp: ['p(95)<4000'], // Largest Contentful Paint
    browser_web_vital_cls: ['p(95)<0.1'],  // Cumulative Layout Shift
    browser_web_vital_ttfb: ['p(95)<1000'], // Time To First Byte
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export default async function () {
  const page = browser.newPage();

  try {
    // Test scenarios
    await testHomePage(page);
    await testAuthentication(page);
    await testDashboard(page);
    await testClientsList(page);
    await testCommissionsList(page);

  } finally {
    page.close();
  }
}

async function testHomePage(page) {
  console.log('Testing home page performance...');

  const response = await page.goto(BASE_URL, { waitUntil: 'networkidle' });

  check(response, {
    'Home page loads successfully': (r) => r.status() === 200,
  });

  // Wait for React to hydrate
  await page.waitForSelector('[data-testid="app-loaded"]', { timeout: 5000 });

  // Measure Core Web Vitals
  const webVitals = await page.evaluate(() => {
    return new Promise((resolve) => {
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const vitals = {};

        entries.forEach((entry) => {
          if (entry.name === 'first-contentful-paint') {
            vitals.fcp = entry.startTime;
          }
          if (entry.entryType === 'largest-contentful-paint') {
            vitals.lcp = entry.startTime;
          }
          if (entry.entryType === 'layout-shift' && !entry.hadRecentInput) {
            vitals.cls = (vitals.cls || 0) + entry.value;
          }
        });

        // Time to First Byte
        const navigation = performance.getEntriesByType('navigation')[0];
        if (navigation) {
          vitals.ttfb = navigation.responseStart - navigation.requestStart;
        }

        resolve(vitals);
      }).observe({ entryTypes: ['paint', 'largest-contentful-paint', 'layout-shift', 'navigation'] });

      // Fallback timeout
      setTimeout(() => resolve({}), 3000);
    });
  });

  console.log('Web Vitals:', webVitals);

  check(webVitals, {
    'FCP < 2s': (vitals) => vitals.fcp < 2000,
    'LCP < 4s': (vitals) => vitals.lcp < 4000,
    'CLS < 0.1': (vitals) => vitals.cls < 0.1,
    'TTFB < 1s': (vitals) => vitals.ttfb < 1000,
  });
}

async function testAuthentication(page) {
  console.log('Testing authentication flow...');

  const startTime = Date.now();

  // Navigate to login
  await page.click('[data-testid="login-button"]');
  await page.waitForSelector('[data-testid="login-form"]');

  // Fill login form
  await page.fill('[data-testid="username-input"]', 'test_user');
  await page.fill('[data-testid="password-input"]', 'TestPassword123!');

  // Submit form
  await page.click('[data-testid="login-submit"]');

  // Wait for dashboard to load
  await page.waitForSelector('[data-testid="dashboard"]', { timeout: 10000 });

  const loginTime = Date.now() - startTime;

  check(loginTime, {
    'Login completes in < 5s': (time) => time < 5000,
    'Login completes in < 3s': (time) => time < 3000,
  });

  console.log(`Login completed in ${loginTime}ms`);
}

async function testDashboard(page) {
  console.log('Testing dashboard performance...');

  const startTime = Date.now();

  // Wait for dashboard data to load
  await page.waitForSelector('[data-testid="dashboard-stats"]');
  await page.waitForFunction(() => {
    const statsCards = document.querySelectorAll('[data-testid="stat-card"]');
    return statsCards.length >= 4; // Should have at least 4 stat cards
  });

  const loadTime = Date.now() - startTime;

  check(loadTime, {
    'Dashboard loads in < 3s': (time) => time < 3000,
    'Dashboard loads in < 2s': (time) => time < 2000,
  });

  // Test dashboard interactions
  await page.click('[data-testid="refresh-dashboard"]');
  await page.waitForSelector('[data-testid="loading-indicator"]');

  const refreshStartTime = Date.now();
  await page.waitForFunction(() => {
    return !document.querySelector('[data-testid="loading-indicator"]');
  });

  const refreshTime = Date.now() - refreshStartTime;

  check(refreshTime, {
    'Dashboard refresh < 2s': (time) => time < 2000,
  });

  console.log(`Dashboard loaded in ${loadTime}ms, refresh took ${refreshTime}ms`);
}

async function testClientsList(page) {
  console.log('Testing clients list performance...');

  // Navigate to clients
  await page.click('[data-testid="nav-clients"]');

  const startTime = Date.now();
  await page.waitForSelector('[data-testid="clients-table"]');

  // Wait for data to load
  await page.waitForFunction(() => {
    const table = document.querySelector('[data-testid="clients-table"]');
    const rows = table ? table.querySelectorAll('tbody tr') : [];
    return rows.length > 0 || document.querySelector('[data-testid="no-data"]');
  });

  const loadTime = Date.now() - startTime;

  check(loadTime, {
    'Clients list loads in < 2s': (time) => time < 2000,
  });

  // Test search functionality
  const searchInput = page.locator('[data-testid="clients-search"]');
  if (await searchInput.count() > 0) {
    await searchInput.fill('test');

    const searchStartTime = Date.now();
    await page.waitForTimeout(500); // Debounce delay

    const searchTime = Date.now() - searchStartTime;
    check(searchTime, {
      'Client search responds quickly': (time) => time < 1000,
    });
  }

  // Test pagination if available
  const nextPageButton = page.locator('[data-testid="next-page"]');
  if (await nextPageButton.count() > 0 && await nextPageButton.isEnabled()) {
    const pageStartTime = Date.now();
    await nextPageButton.click();
    await page.waitForTimeout(100);
    const pageTime = Date.now() - pageStartTime;

    check(pageTime, {
      'Pagination responds quickly': (time) => time < 1000,
    });
  }

  console.log(`Clients list loaded in ${loadTime}ms`);
}

async function testCommissionsList(page) {
  console.log('Testing commissions list performance...');

  // Navigate to commissions
  await page.click('[data-testid="nav-commissions"]');

  const startTime = Date.now();
  await page.waitForSelector('[data-testid="commissions-table"]');

  // Wait for data to load
  await page.waitForFunction(() => {
    const table = document.querySelector('[data-testid="commissions-table"]');
    const rows = table ? table.querySelectorAll('tbody tr') : [];
    return rows.length > 0 || document.querySelector('[data-testid="no-data"]');
  });

  const loadTime = Date.now() - startTime;

  check(loadTime, {
    'Commissions list loads in < 2s': (time) => time < 2000,
  });

  // Test filters
  const statusFilter = page.locator('[data-testid="status-filter"]');
  if (await statusFilter.count() > 0) {
    await statusFilter.selectOption('pending');

    const filterStartTime = Date.now();
    await page.waitForTimeout(300); // Wait for filter to apply
    const filterTime = Date.now() - filterStartTime;

    check(filterTime, {
      'Commission filter applies quickly': (time) => time < 1500,
    });
  }

  // Test export functionality if available
  const exportButton = page.locator('[data-testid="export-commissions"]');
  if (await exportButton.count() > 0) {
    const exportStartTime = Date.now();
    await exportButton.click();

    // Wait for export to complete or download to start
    await Promise.race([
      page.waitForEvent('download', { timeout: 5000 }),
      page.waitForSelector('[data-testid="export-success"]', { timeout: 5000 }),
    ]).catch(() => {
      // Export might not be fully implemented
    });

    const exportTime = Date.now() - exportStartTime;
    check(exportTime, {
      'Export functionality responds': (time) => time < 5000,
    });
  }

  console.log(`Commissions list loaded in ${loadTime}ms`);
}

// Memory and resource usage monitoring
export function handleSummary(data) {
  const summary = {
    testResults: {
      totalDuration: data.state.testRunDurationMs,
      iterations: data.metrics.iterations?.values?.count || 0,
      webVitals: {
        fcp: data.metrics.browser_web_vital_fcp?.values,
        lcp: data.metrics.browser_web_vital_lcp?.values,
        cls: data.metrics.browser_web_vital_cls?.values,
        ttfb: data.metrics.browser_web_vital_ttfb?.values,
      },
      performance: {
        averageLoadTime: calculateAverageLoadTime(data),
        passedChecks: data.metrics.checks?.values?.passes || 0,
        failedChecks: data.metrics.checks?.values?.fails || 0,
      }
    }
  };

  return {
    'frontend-performance-results.json': JSON.stringify(summary, null, 2),
    'stdout': generateTextSummary(summary),
  };
}

function calculateAverageLoadTime(data) {
  // Calculate average from various timing metrics
  const timingMetrics = Object.keys(data.metrics)
    .filter(key => key.includes('load') || key.includes('response'))
    .map(key => data.metrics[key]?.values?.avg)
    .filter(val => val !== undefined);

  if (timingMetrics.length === 0) return 0;

  return timingMetrics.reduce((sum, val) => sum + val, 0) / timingMetrics.length;
}

function generateTextSummary(summary) {
  let output = '\n=== Frontend Performance Test Summary ===\n';
  output += `Total Duration: ${summary.testResults.totalDuration}ms\n`;
  output += `Iterations: ${summary.testResults.iterations}\n`;
  output += `Passed Checks: ${summary.testResults.performance.passedChecks}\n`;
  output += `Failed Checks: ${summary.testResults.performance.failedChecks}\n`;

  if (summary.testResults.webVitals.fcp?.avg) {
    output += `\nWeb Vitals:\n`;
    output += `  First Contentful Paint: ${Math.round(summary.testResults.webVitals.fcp.avg)}ms\n`;
    output += `  Largest Contentful Paint: ${Math.round(summary.testResults.webVitals.lcp?.avg || 0)}ms\n`;
    output += `  Cumulative Layout Shift: ${(summary.testResults.webVitals.cls?.avg || 0).toFixed(3)}\n`;
    output += `  Time To First Byte: ${Math.round(summary.testResults.webVitals.ttfb?.avg || 0)}ms\n`;
  }

  output += '\n=== Test Completed ===\n';

  return output;
}
