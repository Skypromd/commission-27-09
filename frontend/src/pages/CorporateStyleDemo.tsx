import React from 'react';
import UniversalLayout from '../components/layout/UniversalLayout';
import '../styles/corporate-design-system.css';

const CorporateStyleDemo = () => {
  return (
    <UniversalLayout>
      <div className="page-content">
        {/* Hero Section */}
        <div className="card mb-lg">
          <div className="card-body text-center">
            <h1 className="mb-md">UK Commission Management System</h1>
            <p className="text-muted mb-lg">Corporate Design System Demonstration</p>
            <div className="d-flex justify-content-center gap-md">
              <button className="btn btn-primary btn-lg">Get Started</button>
              <button className="btn btn-secondary btn-lg">Learn More</button>
            </div>
          </div>
        </div>

        {/* Color Palette Demo */}
        <div className="card mb-lg">
          <div className="card-header">
            <h3 className="card-title">🎨 Corporate Color Palette</h3>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6">
                <h5 className="mb-md">Primary Colors</h5>
                <div className="d-flex gap-md mb-lg">
                  <div className="text-center">
                    <div style={{
                      width: '60px',
                      height: '60px',
                      backgroundColor: 'var(--color-primary-dark)',
                      borderRadius: 'var(--border-radius-md)',
                      marginBottom: 'var(--spacing-sm)'
                    }}></div>
                    <small className="text-muted">Dark Blue</small>
                  </div>
                  <div className="text-center">
                    <div style={{
                      width: '60px',
                      height: '60px',
                      backgroundColor: 'var(--color-primary)',
                      borderRadius: 'var(--border-radius-md)',
                      marginBottom: 'var(--spacing-sm)'
                    }}></div>
                    <small className="text-muted">Primary</small>
                  </div>
                  <div className="text-center">
                    <div style={{
                      width: '60px',
                      height: '60px',
                      backgroundColor: 'var(--color-primary-light)',
                      borderRadius: 'var(--border-radius-md)',
                      marginBottom: 'var(--spacing-sm)'
                    }}></div>
                    <small className="text-muted">Light Blue</small>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <h5 className="mb-md">Accent Colors</h5>
                <div className="d-flex gap-md mb-lg">
                  <div className="text-center">
                    <div style={{
                      width: '60px',
                      height: '60px',
                      backgroundColor: 'var(--color-success)',
                      borderRadius: 'var(--border-radius-md)',
                      marginBottom: 'var(--spacing-sm)'
                    }}></div>
                    <small className="text-muted">Success</small>
                  </div>
                  <div className="text-center">
                    <div style={{
                      width: '60px',
                      height: '60px',
                      backgroundColor: 'var(--color-warning)',
                      borderRadius: 'var(--border-radius-md)',
                      marginBottom: 'var(--spacing-sm)'
                    }}></div>
                    <small className="text-muted">Warning</small>
                  </div>
                  <div className="text-center">
                    <div style={{
                      width: '60px',
                      height: '60px',
                      backgroundColor: 'var(--color-error)',
                      borderRadius: 'var(--border-radius-md)',
                      marginBottom: 'var(--spacing-sm)'
                    }}></div>
                    <small className="text-muted">Error</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Typography Demo */}
        <div className="card mb-lg">
          <div className="card-header">
            <h3 className="card-title">📝 Typography System</h3>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6">
                <h1>Heading 1 - Executive</h1>
                <h2>Heading 2 - Section Title</h2>
                <h3>Heading 3 - Subsection</h3>
                <h4>Heading 4 - Card Title</h4>
                <h5>Heading 5 - Component</h5>
                <h6>Heading 6 - Small Header</h6>
              </div>
              <div className="col-md-6">
                <p><strong>Body Large (16px)</strong> - Main content text for readability</p>
                <p>Body Regular (14px) - Standard text for most content areas</p>
                <p><small>Body Small (12px) - Secondary information and captions</small></p>
                <p style={{fontSize: 'var(--font-size-xs)'}}><strong>Caption (10px)</strong> - Labels and tiny text</p>
                <code>Monospace Font - Code and technical content</code>
              </div>
            </div>
          </div>
        </div>

        {/* Button Components */}
        <div className="card mb-lg">
          <div className="card-header">
            <h3 className="card-title">🎛️ Button Components</h3>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-4">
                <h5>Primary Buttons</h5>
                <div className="d-flex flex-column gap-md mb-lg">
                  <button className="btn btn-primary btn-sm">Small Primary</button>
                  <button className="btn btn-primary">Regular Primary</button>
                  <button className="btn btn-primary btn-lg">Large Primary</button>
                </div>
              </div>
              <div className="col-md-4">
                <h5>Secondary Buttons</h5>
                <div className="d-flex flex-column gap-md mb-lg">
                  <button className="btn btn-secondary btn-sm">Small Secondary</button>
                  <button className="btn btn-secondary">Regular Secondary</button>
                  <button className="btn btn-secondary btn-lg">Large Secondary</button>
                </div>
              </div>
              <div className="col-md-4">
                <h5>Action Buttons</h5>
                <div className="d-flex flex-column gap-md mb-lg">
                  <button className="btn btn-success">Success Action</button>
                  <button className="btn btn-warning">Warning Action</button>
                  <button className="btn btn-danger">Danger Action</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Elements */}
        <div className="card mb-lg">
          <div className="card-header">
            <h3 className="card-title">📋 Form Elements</h3>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label className="form-label">Text Input</label>
                  <input type="text" className="form-input" placeholder="Enter your text here" />
                </div>
                <div className="form-group">
                  <label className="form-label">Select Dropdown</label>
                  <select className="form-select">
                    <option>Choose an option</option>
                    <option>Option 1</option>
                    <option>Option 2</option>
                    <option>Option 3</option>
                  </select>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label className="form-label">Textarea</label>
                  <textarea className="form-textarea" placeholder="Enter your message here"></textarea>
                </div>
                <div className="form-group">
                  <label className="form-label">Validation States</label>
                  <input type="email" className="form-input is-valid" value="valid@example.com" />
                  <input type="email" className="form-input is-invalid mt-sm" placeholder="invalid-email" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="card mb-lg">
          <div className="card-header">
            <h3 className="card-title">📊 Data Tables</h3>
          </div>
          <div className="card-body">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Last Login</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>#001</td>
                  <td>John Smith</td>
                  <td><span className="badge bg-primary">Administrator</span></td>
                  <td><span className="text-success">● Active</span></td>
                  <td>2024-08-21 10:30</td>
                  <td>
                    <button className="btn btn-sm btn-secondary">Edit</button>
                    <button className="btn btn-sm btn-danger ml-sm">Delete</button>
                  </td>
                </tr>
                <tr>
                  <td>#002</td>
                  <td>Sarah Johnson</td>
                  <td><span className="badge bg-success">Consultant</span></td>
                  <td><span className="text-success">● Active</span></td>
                  <td>2024-08-21 09:15</td>
                  <td>
                    <button className="btn btn-sm btn-secondary">Edit</button>
                    <button className="btn btn-sm btn-danger ml-sm">Delete</button>
                  </td>
                </tr>
                <tr>
                  <td>#003</td>
                  <td>Michael Brown</td>
                  <td><span className="badge bg-warning">Manager</span></td>
                  <td><span className="text-muted">● Offline</span></td>
                  <td>2024-08-20 16:45</td>
                  <td>
                    <button className="btn btn-sm btn-secondary">Edit</button>
                    <button className="btn btn-sm btn-danger ml-sm">Delete</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="row mb-lg">
          <div className="col-md-3">
            <div className="card text-center">
              <div className="card-body">
                <div style={{ fontSize: '2rem', color: 'var(--color-primary)' }}>📊</div>
                <h4 className="text-primary">1,234</h4>
                <p className="text-muted mb-0">Total Users</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-center">
              <div className="card-body">
                <div style={{ fontSize: '2rem', color: 'var(--color-success)' }}>💰</div>
                <h4 className="text-success">£456,789</h4>
                <p className="text-muted mb-0">Total Revenue</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-center">
              <div className="card-body">
                <div style={{ fontSize: '2rem', color: 'var(--color-warning)' }}>⏳</div>
                <h4 className="text-warning">67</h4>
                <p className="text-muted mb-0">Pending Items</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-center">
              <div className="card-body">
                <div style={{ fontSize: '2rem', color: 'var(--color-info)' }}>🎯</div>
                <h4 style={{ color: 'var(--color-info)' }}>98.5%</h4>
                <p className="text-muted mb-0">Success Rate</p>
              </div>
            </div>
          </div>
        </div>

        {/* Responsive Grid Demo */}
        <div className="card mb-lg">
          <div className="card-header">
            <h3 className="card-title">📱 Responsive Grid System</h3>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-lg-8 col-md-12">
                <div className="card bg-light">
                  <div className="card-body text-center">
                    <h5>Main Content Area</h5>
                    <p>This area adapts to different screen sizes</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-12">
                <div className="card bg-primary text-white">
                  <div className="card-body text-center">
                    <h5>Sidebar Area</h5>
                    <p>Responsive sidebar content</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Animation Demo */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">✨ Animation Examples</h3>
          </div>
          <div className="card-body">
            <div className="d-flex gap-md">
              <button className="btn btn-primary fade-in" style={{ animationDelay: '0.1s' }}>
                Fade In
              </button>
              <button className="btn btn-secondary slide-up" style={{ animationDelay: '0.2s' }}>
                Slide Up
              </button>
              <button className="btn btn-success bounce" style={{ animationDelay: '0.3s' }}>
                Bounce
              </button>
            </div>
            <div className="mt-lg">
              <div className="d-flex align-items-center gap-md">
                <div style={{
                  width: '12px',
                  height: '12px',
                  backgroundColor: 'var(--color-success)',
                  borderRadius: '50%',
                  animation: 'pulse 2s infinite'
                }}></div>
                <span>Pulsing Status Indicator</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UniversalLayout>
  );
};

export default CorporateStyleDemo;
