// Frontend Integration Test Script
// Run this in the browser console or as a Node.js script

const API_BASE_URL = 'http://localhost:8000/api';

// Test functions
async function testAPIEndpoints() {
    console.log('🚀 Testing Frontend-Backend Integration...');
    console.log('=' * 50);
    
    const results = {};
    
    try {
        // Test 1: Get blog posts
        console.log('Testing GET /api/posts/...');
        const postsResponse = await fetch(`${API_BASE_URL}/posts/`);
        if (postsResponse.ok) {
            const postsData = await postsResponse.json();
            console.log(`✅ Blog posts endpoint working - ${postsData.results?.length || 0} posts returned`);
            results.posts = true;
        } else {
            console.log(`❌ Blog posts endpoint failed - Status: ${postsResponse.status}`);
            results.posts = false;
        }
        
        // Test 2: Get categories
        console.log('Testing GET /api/categories/...');
        const categoriesResponse = await fetch(`${API_BASE_URL}/categories/`);
        if (categoriesResponse.ok) {
            const categoriesData = await categoriesResponse.json();
            console.log(`✅ Categories endpoint working - ${categoriesData.categories?.length || 0} categories returned`);
            results.categories = true;
        } else {
            console.log(`❌ Categories endpoint failed - Status: ${categoriesResponse.status}`);
            results.categories = false;
        }
        
        // Test 3: Test authentication
        console.log('Testing authentication...');
        
        // Test login
        const loginData = {
            username: 'johndoe',
            password: 'password123'
        };
        
        const loginResponse = await fetch(`${API_BASE_URL}/auth/login/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginData)
        });
        
        if (loginResponse.ok) {
            const loginResult = await loginResponse.json();
            if (loginResult.access && loginResult.refresh) {
                console.log('✅ Login endpoint working - JWT tokens received');
                results.login = true;
                
                // Test authenticated endpoints
                const headers = {
                    'Authorization': `Bearer ${loginResult.access}`,
                    'Content-Type': 'application/json'
                };
                
                // Test profile endpoint
                console.log('Testing GET /api/profile/...');
                const profileResponse = await fetch(`${API_BASE_URL}/profile/`, { headers });
                if (profileResponse.ok) {
                    console.log('✅ Profile endpoint working');
                    results.profile = true;
                } else {
                    console.log(`❌ Profile endpoint failed - Status: ${profileResponse.status}`);
                    results.profile = false;
                }
                
                // Test create post endpoint
                console.log('Testing POST /api/posts/...');
                const postData = {
                    title: 'Frontend Test Post',
                    content: 'This is a test post created from frontend integration test.',
                    category: 'Technology'
                };
                
                const createPostResponse = await fetch(`${API_BASE_URL}/posts/`, {
                    method: 'POST',
                    headers,
                    body: JSON.stringify(postData)
                });
                
                if (createPostResponse.ok) {
                    console.log('✅ Create post endpoint working');
                    results.createPost = true;
                } else {
                    console.log(`❌ Create post endpoint failed - Status: ${createPostResponse.status}`);
                    results.createPost = false;
                }
                
            } else {
                console.log('❌ Login endpoint failed - No tokens received');
                results.login = false;
            }
        } else {
            console.log(`❌ Login endpoint failed - Status: ${loginResponse.status}`);
            results.login = false;
        }
        
        return results;
        
    } catch (error) {
        console.error('❌ API test failed:', error);
        return false;
    }
}

// Test localStorage functionality
function testLocalStorage() {
    console.log('\n🔍 Testing Local Storage...');
    
    try {
        // Test token storage
        localStorage.setItem('test_token', 'test_value');
        const retrieved = localStorage.getItem('test_token');
        if (retrieved === 'test_value') {
            console.log('✅ Local storage working');
            localStorage.removeItem('test_token');
            return true;
        } else {
            console.log('❌ Local storage not working');
            return false;
        }
    } catch (error) {
        console.log('❌ Local storage test failed:', error);
        return false;
    }
}

// Test CORS
async function testCORS() {
    console.log('\n🔍 Testing CORS...');
    
    try {
        const response = await fetch(`${API_BASE_URL}/posts/`, {
            method: 'OPTIONS'
        });
        
        if (response.ok) {
            console.log('✅ CORS preflight request successful');
            return true;
        } else {
            console.log('❌ CORS preflight request failed');
            return false;
        }
    } catch (error) {
        console.log('❌ CORS test failed:', error);
        return false;
    }
}

// Main test function
async function runAllTests() {
    console.log('🚀 Starting Frontend Integration Tests');
    console.log('=' * 50);
    
    // Test 1: Local Storage
    const localStorageTest = testLocalStorage();
    
    // Test 2: CORS
    const corsTest = await testCORS();
    
    // Test 3: API Endpoints
    const apiResults = await testAPIEndpoints();
    
    // Summary
    console.log('\n' + '=' * 50);
    console.log('📊 TEST SUMMARY');
    console.log('=' * 50);
    
    console.log(`Local Storage: ${localStorageTest ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`CORS: ${corsTest ? '✅ PASS' : '❌ FAIL'}`);
    
    if (apiResults) {
        console.log('\nAPI Endpoints:');
        for (const [endpoint, status] of Object.entries(apiResults)) {
            console.log(`  ${endpoint}: ${status ? '✅ PASS' : '❌ FAIL'}`);
        }
    }
    
    // Overall status
    const allTests = [localStorageTest, corsTest];
    if (apiResults) {
        allTests.push(...Object.values(apiResults));
    }
    
    if (allTests.every(test => test)) {
        console.log('\n🎉 ALL TESTS PASSED! Frontend-Backend integration is working perfectly.');
    } else {
        console.log('\n⚠️  Some tests failed. Please check the issues above.');
    }
    
    console.log('\n🔗 Next Steps:');
    console.log('  1. Start your React frontend: npm run dev');
    console.log('  2. Test the login functionality in the browser');
    console.log('  3. Try creating a blog post');
    console.log('  4. Test the search and pagination features');
}

// Export for Node.js or run directly in browser
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { runAllTests, testAPIEndpoints, testLocalStorage, testCORS };
} else {
    // Browser environment
    window.runAllTests = runAllTests;
    window.testAPIEndpoints = testAPIEndpoints;
    window.testLocalStorage = testLocalStorage;
    window.testCORS = testCORS;
    
    // Auto-run if in browser console
    if (typeof window !== 'undefined') {
        console.log('Frontend integration tests loaded. Run runAllTests() to start testing.');
    }
} 