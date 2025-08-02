import requests
import time
import json

def test_authentication():
    print("Testing Authentication Endpoints...")
    time.sleep(3)  # Wait for server to start
    
    base_url = 'http://localhost:8000/api'
    
    try:
        # Test registration
        print("\n1. Testing Registration...")
        register_data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'testpass123',
            'password2': 'testpass123',  # Added password2 field
            'first_name': 'Test',
            'last_name': 'User'
        }
        
        response = requests.post(f'{base_url}/auth/register/', json=register_data)
        print(f'Registration Status: {response.status_code}')
        if response.status_code == 201:
            print("✅ Registration working!")
            print(response.json())
        else:
            print("❌ Registration failed")
            print(response.text)
        
        # Test login with existing user
        print("\n2. Testing Login with johndoe...")
        login_data = {
            'username': 'johndoe',
            'password': 'password123'
        }
        
        response = requests.post(f'{base_url}/auth/login/', json=login_data)
        print(f'Login Status: {response.status_code}')
        if response.status_code == 200:
            print("✅ Login working!")
            tokens = response.json()
            print(f"Access token received: {tokens.get('access', 'N/A')[:20]}...")
            
            # Test protected endpoint
            print("\n3. Testing Protected Endpoint...")
            headers = {'Authorization': f"Bearer {tokens['access']}"}
            response = requests.get(f'{base_url}/profile/', headers=headers)
            print(f'Profile Status: {response.status_code}')
            if response.status_code == 200:
                print("✅ Protected endpoint working!")
                print(response.json())
            else:
                print("❌ Protected endpoint failed")
                print(response.text)
        else:
            print("❌ Login failed")
            print(response.text)
            
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to Django server. Make sure it's running on localhost:8000")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_authentication() 