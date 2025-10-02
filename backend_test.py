#!/usr/bin/env python3
"""
Backend API Testing Script for Commission Tracker Authentication System
Tests all authentication endpoints with comprehensive scenarios.
"""

import requests
import json
import sys
import os
from datetime import datetime

# Configuration
BASE_URL = "http://localhost:8000"  # From frontend/.env VITE_API_URL
API_BASE = f"{BASE_URL}/api"

class AuthenticationTester:
    def __init__(self):
        self.session = requests.Session()
        self.test_results = []
        self.test_user_token = None
        self.admin_token = None
        
    def log_test(self, test_name, success, message, response_data=None):
        """Log test results"""
        result = {
            'test': test_name,
            'success': success,
            'message': message,
            'timestamp': datetime.now().isoformat(),
            'response_data': response_data
        }
        self.test_results.append(result)
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status}: {test_name} - {message}")
        if response_data and not success:
            print(f"   Response: {json.dumps(response_data, indent=2)}")
    
    def test_user_registration(self):
        """Test POST /api/users/auth/register/ endpoint"""
        print("\n=== Testing User Registration ===")
        
        # Test 1: Valid registration
        import time
        timestamp = str(int(time.time()))
        test_user_data = {
            "username": f"testuser{timestamp}",
            "email": f"testuser{timestamp}@example.com",
            "password": "SecurePassword123!",
            "first_name": "John",
            "last_name": "Doe"
        }
        
        try:
            response = self.session.post(f"{API_BASE}/users/auth/register/", json=test_user_data)
            
            if response.status_code == 201:
                data = response.json()
                if data.get('success') and data.get('token') and data.get('user'):
                    self.test_user_token = data['token']
                    self.log_test(
                        "User Registration - Valid Data",
                        True,
                        f"User registered successfully with token",
                        data
                    )
                else:
                    self.log_test(
                        "User Registration - Valid Data",
                        False,
                        "Registration succeeded but response format incorrect",
                        data
                    )
            else:
                self.log_test(
                    "User Registration - Valid Data",
                    False,
                    f"Registration failed with status {response.status_code}",
                    response.json() if response.content else None
                )
        except Exception as e:
            self.log_test(
                "User Registration - Valid Data",
                False,
                f"Request failed: {str(e)}"
            )
        
        # Test 2: Duplicate username
        try:
            response = self.session.post(f"{API_BASE}/users/auth/register/", json=test_user_data)
            
            if response.status_code == 400:
                data = response.json()
                if not data.get('success') and 'errors' in data:
                    self.log_test(
                        "User Registration - Duplicate Username",
                        True,
                        "Correctly rejected duplicate username",
                        data
                    )
                else:
                    self.log_test(
                        "User Registration - Duplicate Username",
                        False,
                        "Response format incorrect for duplicate username",
                        data
                    )
            else:
                self.log_test(
                    "User Registration - Duplicate Username",
                    False,
                    f"Should have returned 400, got {response.status_code}",
                    response.json() if response.content else None
                )
        except Exception as e:
            self.log_test(
                "User Registration - Duplicate Username",
                False,
                f"Request failed: {str(e)}"
            )
        
        # Test 3: Invalid email
        invalid_email_data = test_user_data.copy()
        invalid_email_data['username'] = f'testuser{timestamp}456'
        invalid_email_data['email'] = 'invalid-email'
        
        try:
            response = self.session.post(f"{API_BASE}/users/auth/register/", json=invalid_email_data)
            
            if response.status_code == 400:
                data = response.json()
                if not data.get('success') and 'errors' in data:
                    self.log_test(
                        "User Registration - Invalid Email",
                        True,
                        "Correctly rejected invalid email",
                        data
                    )
                else:
                    self.log_test(
                        "User Registration - Invalid Email",
                        False,
                        "Response format incorrect for invalid email",
                        data
                    )
            else:
                self.log_test(
                    "User Registration - Invalid Email",
                    False,
                    f"Should have returned 400, got {response.status_code}",
                    response.json() if response.content else None
                )
        except Exception as e:
            self.log_test(
                "User Registration - Invalid Email",
                False,
                f"Request failed: {str(e)}"
            )
        
        # Test 4: Weak password
        weak_password_data = test_user_data.copy()
        weak_password_data['username'] = 'testuser789'
        weak_password_data['email'] = 'testuser789@example.com'
        weak_password_data['password'] = '123'
        
        try:
            response = self.session.post(f"{API_BASE}/users/auth/register/", json=weak_password_data)
            
            if response.status_code == 400:
                data = response.json()
                if not data.get('success') and 'errors' in data:
                    self.log_test(
                        "User Registration - Weak Password",
                        True,
                        "Correctly rejected weak password",
                        data
                    )
                else:
                    self.log_test(
                        "User Registration - Weak Password",
                        False,
                        "Response format incorrect for weak password",
                        data
                    )
            else:
                self.log_test(
                    "User Registration - Weak Password",
                    False,
                    f"Should have returned 400, got {response.status_code}",
                    response.json() if response.content else None
                )
        except Exception as e:
            self.log_test(
                "User Registration - Weak Password",
                False,
                f"Request failed: {str(e)}"
            )
    
    def test_user_login(self):
        """Test POST /api/users/auth/login/ endpoint"""
        print("\n=== Testing User Login ===")
        
        # Test 1: Login with newly registered user
        login_data = {
            "username": "testuser123",
            "password": "SecurePassword123!"
        }
        
        try:
            response = self.session.post(f"{API_BASE}/users/auth/login/", json=login_data)
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success') and data.get('token') and data.get('user'):
                    self.test_user_token = data['token']  # Update token
                    self.log_test(
                        "User Login - Valid Credentials",
                        True,
                        f"Login successful with token",
                        data
                    )
                else:
                    self.log_test(
                        "User Login - Valid Credentials",
                        False,
                        "Login succeeded but response format incorrect",
                        data
                    )
            else:
                self.log_test(
                    "User Login - Valid Credentials",
                    False,
                    f"Login failed with status {response.status_code}",
                    response.json() if response.content else None
                )
        except Exception as e:
            self.log_test(
                "User Login - Valid Credentials",
                False,
                f"Request failed: {str(e)}"
            )
        
        # Test 2: Login with admin credentials
        admin_login_data = {
            "username": "admin",
            "password": "admin"
        }
        
        try:
            response = self.session.post(f"{API_BASE}/users/auth/login/", json=admin_login_data)
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success') and data.get('token') and data.get('user'):
                    self.admin_token = data['token']
                    self.log_test(
                        "User Login - Admin Credentials",
                        True,
                        f"Admin login successful",
                        data
                    )
                else:
                    self.log_test(
                        "User Login - Admin Credentials",
                        False,
                        "Admin login succeeded but response format incorrect",
                        data
                    )
            else:
                self.log_test(
                    "User Login - Admin Credentials",
                    False,
                    f"Admin login failed with status {response.status_code}",
                    response.json() if response.content else None
                )
        except Exception as e:
            self.log_test(
                "User Login - Admin Credentials",
                False,
                f"Request failed: {str(e)}"
            )
        
        # Test 3: Invalid credentials
        invalid_login_data = {
            "username": "testuser123",
            "password": "wrongpassword"
        }
        
        try:
            response = self.session.post(f"{API_BASE}/users/auth/login/", json=invalid_login_data)
            
            if response.status_code == 401:
                data = response.json()
                if not data.get('success') and 'error' in data:
                    self.log_test(
                        "User Login - Invalid Credentials",
                        True,
                        "Correctly rejected invalid credentials",
                        data
                    )
                else:
                    self.log_test(
                        "User Login - Invalid Credentials",
                        False,
                        "Response format incorrect for invalid credentials",
                        data
                    )
            else:
                self.log_test(
                    "User Login - Invalid Credentials",
                    False,
                    f"Should have returned 401, got {response.status_code}",
                    response.json() if response.content else None
                )
        except Exception as e:
            self.log_test(
                "User Login - Invalid Credentials",
                False,
                f"Request failed: {str(e)}"
            )
    
    def test_protected_route(self):
        """Test GET /api/users/users/me/ endpoint (protected route)"""
        print("\n=== Testing Protected Route (/users/me) ===")
        
        # Test 1: Access with valid token
        if self.test_user_token:
            headers = {'Authorization': f'Token {self.test_user_token}'}
            
            try:
                response = self.session.get(f"{API_BASE}/users/users/me/", headers=headers)
                
                if response.status_code == 200:
                    data = response.json()
                    if 'username' in data and 'email' in data:
                        self.log_test(
                            "Protected Route - Valid Token",
                            True,
                            "Successfully accessed user profile",
                            data
                        )
                    else:
                        self.log_test(
                            "Protected Route - Valid Token",
                            False,
                            "Response format incorrect for user profile",
                            data
                        )
                else:
                    self.log_test(
                        "Protected Route - Valid Token",
                        False,
                        f"Failed to access profile with status {response.status_code}",
                        response.json() if response.content else None
                    )
            except Exception as e:
                self.log_test(
                    "Protected Route - Valid Token",
                    False,
                    f"Request failed: {str(e)}"
                )
        else:
            self.log_test(
                "Protected Route - Valid Token",
                False,
                "No valid token available for testing"
            )
        
        # Test 2: Access without token
        try:
            response = self.session.get(f"{API_BASE}/users/users/me/")
            
            if response.status_code == 401:
                self.log_test(
                    "Protected Route - No Token",
                    True,
                    "Correctly rejected request without token",
                    response.json() if response.content else None
                )
            else:
                self.log_test(
                    "Protected Route - No Token",
                    False,
                    f"Should have returned 401, got {response.status_code}",
                    response.json() if response.content else None
                )
        except Exception as e:
            self.log_test(
                "Protected Route - No Token",
                False,
                f"Request failed: {str(e)}"
            )
        
        # Test 3: Access with invalid token
        headers = {'Authorization': 'Token invalid_token_12345'}
        
        try:
            response = self.session.get(f"{API_BASE}/users/users/me/", headers=headers)
            
            if response.status_code == 401:
                self.log_test(
                    "Protected Route - Invalid Token",
                    True,
                    "Correctly rejected request with invalid token",
                    response.json() if response.content else None
                )
            else:
                self.log_test(
                    "Protected Route - Invalid Token",
                    False,
                    f"Should have returned 401, got {response.status_code}",
                    response.json() if response.content else None
                )
        except Exception as e:
            self.log_test(
                "Protected Route - Invalid Token",
                False,
                f"Request failed: {str(e)}"
            )
    
    def test_user_logout(self):
        """Test POST /api/users/auth/logout/ endpoint"""
        print("\n=== Testing User Logout ===")
        
        # Test 1: Logout with valid token
        if self.test_user_token:
            headers = {'Authorization': f'Token {self.test_user_token}'}
            
            try:
                response = self.session.post(f"{API_BASE}/users/auth/logout/", headers=headers)
                
                if response.status_code == 200:
                    data = response.json()
                    if data.get('success') and 'message' in data:
                        self.log_test(
                            "User Logout - Valid Token",
                            True,
                            "Successfully logged out",
                            data
                        )
                        
                        # Test that token is invalidated by trying to access protected route
                        profile_response = self.session.get(f"{API_BASE}/users/users/me/", headers=headers)
                        if profile_response.status_code == 401:
                            self.log_test(
                                "Token Invalidation After Logout",
                                True,
                                "Token correctly invalidated after logout"
                            )
                        else:
                            self.log_test(
                                "Token Invalidation After Logout",
                                False,
                                f"Token still valid after logout, got status {profile_response.status_code}"
                            )
                    else:
                        self.log_test(
                            "User Logout - Valid Token",
                            False,
                            "Logout succeeded but response format incorrect",
                            data
                        )
                else:
                    self.log_test(
                        "User Logout - Valid Token",
                        False,
                        f"Logout failed with status {response.status_code}",
                        response.json() if response.content else None
                    )
            except Exception as e:
                self.log_test(
                    "User Logout - Valid Token",
                    False,
                    f"Request failed: {str(e)}"
                )
        else:
            self.log_test(
                "User Logout - Valid Token",
                False,
                "No valid token available for testing"
            )
        
        # Test 2: Logout without token
        try:
            response = self.session.post(f"{API_BASE}/users/auth/logout/")
            
            if response.status_code == 401:
                self.log_test(
                    "User Logout - No Token",
                    True,
                    "Correctly rejected logout without token"
                )
            else:
                self.log_test(
                    "User Logout - No Token",
                    False,
                    f"Should have returned 401, got {response.status_code}",
                    response.json() if response.content else None
                )
        except Exception as e:
            self.log_test(
                "User Logout - No Token",
                False,
                f"Request failed: {str(e)}"
            )
    
    def test_complete_auth_flow(self):
        """Test complete authentication flow"""
        print("\n=== Testing Complete Authentication Flow ===")
        
        # Step 1: Register new user for flow test
        flow_user_data = {
            "username": "flowtest456",
            "email": "flowtest456@example.com",
            "password": "FlowTestPassword123!",
            "first_name": "Flow",
            "last_name": "Test"
        }
        
        try:
            # Register
            register_response = self.session.post(f"{API_BASE}/users/auth/register/", json=flow_user_data)
            
            if register_response.status_code != 201:
                self.log_test(
                    "Complete Auth Flow",
                    False,
                    f"Registration failed in flow test: {register_response.status_code}"
                )
                return
            
            register_data = register_response.json()
            flow_token = register_data.get('token')
            
            # Step 2: Login with new user
            login_response = self.session.post(f"{API_BASE}/users/auth/login/", json={
                "username": "flowtest456",
                "password": "FlowTestPassword123!"
            })
            
            if login_response.status_code != 200:
                self.log_test(
                    "Complete Auth Flow",
                    False,
                    f"Login failed in flow test: {login_response.status_code}"
                )
                return
            
            login_data = login_response.json()
            flow_token = login_data.get('token')  # Update token
            
            # Step 3: Access protected route
            headers = {'Authorization': f'Token {flow_token}'}
            profile_response = self.session.get(f"{API_BASE}/users/users/me/", headers=headers)
            
            if profile_response.status_code != 200:
                self.log_test(
                    "Complete Auth Flow",
                    False,
                    f"Protected route access failed in flow test: {profile_response.status_code}"
                )
                return
            
            # Step 4: Logout
            logout_response = self.session.post(f"{API_BASE}/users/auth/logout/", headers=headers)
            
            if logout_response.status_code != 200:
                self.log_test(
                    "Complete Auth Flow",
                    False,
                    f"Logout failed in flow test: {logout_response.status_code}"
                )
                return
            
            # Step 5: Verify token invalidation
            final_profile_response = self.session.get(f"{API_BASE}/users/users/me/", headers=headers)
            
            if final_profile_response.status_code == 401:
                self.log_test(
                    "Complete Auth Flow",
                    True,
                    "Complete authentication flow successful: Register → Login → Access Protected → Logout → Token Invalidated"
                )
            else:
                self.log_test(
                    "Complete Auth Flow",
                    False,
                    f"Token not invalidated after logout: {final_profile_response.status_code}"
                )
                
        except Exception as e:
            self.log_test(
                "Complete Auth Flow",
                False,
                f"Flow test failed: {str(e)}"
            )
    
    def run_all_tests(self):
        """Run all authentication tests"""
        print(f"🚀 Starting Authentication API Tests")
        print(f"📍 Base URL: {BASE_URL}")
        print(f"📍 API Base: {API_BASE}")
        print("=" * 60)
        
        # Check if backend is running
        try:
            response = self.session.get(f"{API_BASE}/")
            print(f"✅ Backend is running (Status: {response.status_code})")
        except Exception as e:
            print(f"❌ Backend is not accessible: {str(e)}")
            return
        
        # Run all tests
        self.test_user_registration()
        self.test_user_login()
        self.test_protected_route()
        self.test_user_logout()
        self.test_complete_auth_flow()
        
        # Summary
        print("\n" + "=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        
        total_tests = len(self.test_results)
        passed_tests = sum(1 for result in self.test_results if result['success'])
        failed_tests = total_tests - passed_tests
        
        print(f"Total Tests: {total_tests}")
        print(f"✅ Passed: {passed_tests}")
        print(f"❌ Failed: {failed_tests}")
        print(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%")
        
        if failed_tests > 0:
            print(f"\n🔍 FAILED TESTS:")
            for result in self.test_results:
                if not result['success']:
                    print(f"   • {result['test']}: {result['message']}")
        
        return failed_tests == 0

if __name__ == "__main__":
    tester = AuthenticationTester()
    success = tester.run_all_tests()
    sys.exit(0 if success else 1)