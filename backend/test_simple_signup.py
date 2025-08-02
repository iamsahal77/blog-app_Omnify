import requests
import time

def test_simple_signup():
    print("Testing Simplified Signup (username, email, password only)...")
    time.sleep(2)
    
    base_url = 'http://localhost:8000/api'
    
    try:
        # Test simplified registration
        print("\n1. Testing Simplified Registration...")
        register_data = {
            'username': 'simpleuser',
            'email': 'simple@example.com',
            'password': 'simplepass123',
            'password2': 'simplepass123'
            # No first_name or last_name
        }
        
        response = requests.post(f'{base_url}/auth/register/', json=register_data)
        print(f'Registration Status: {response.status_code}')
        if response.status_code == 201:
            print("✅ Simplified registration working!")
            print(response.json())
        else:
            print("❌ Registration failed")
            print(response.text)
        
        # Test login with the new user
        print("\n2. Testing Login with new user...")
        login_data = {
            'username': 'simpleuser',
            'password': 'simplepass123'
        }
        
        response = requests.post(f'{base_url}/auth/login/', json=login_data)
        print(f'Login Status: {response.status_code}')
        if response.status_code == 200:
            print("✅ Login working!")
            tokens = response.json()
            print(f"Access token received: {tokens.get('access', 'N/A')[:20]}...")
            
            # Test profile access
            print("\n3. Testing Profile Access...")
            headers = {'Authorization': f"Bearer {tokens['access']}"}
            response = requests.get(f'{base_url}/profile/', headers=headers)
            print(f'Profile Status: {response.status_code}')
            if response.status_code == 200:
                print("✅ Profile access working!")
                profile = response.json()
                print(f"User: {profile['user']['username']}")
                print(f"Email: {profile['user']['email']}")
                print(f"First Name: '{profile['user']['first_name']}' (empty)")
                print(f"Last Name: '{profile['user']['last_name']}' (empty)")
            else:
                print("❌ Profile access failed")
                print(response.text)
        else:
            print("❌ Login failed")
            print(response.text)
            
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to Django server. Make sure it's running on localhost:8000")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_simple_signup() 