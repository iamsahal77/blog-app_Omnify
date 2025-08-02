import requests

def test_login_credentials():
    print("Testing Login Credentials...")
    
    # Test with johndoe
    print("\n1. Testing johndoe / password123")
    response = requests.post('http://localhost:8000/api/auth/login/', 
                           json={'username': 'johndoe', 'password': 'password123'})
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        print("✅ johndoe login successful!")
    else:
        print(f"❌ johndoe login failed: {response.text}")
    
    # Test with janesmith
    print("\n2. Testing janesmith / password123")
    response = requests.post('http://localhost:8000/api/auth/login/', 
                           json={'username': 'janesmith', 'password': 'password123'})
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        print("✅ janesmith login successful!")
    else:
        print(f"❌ janesmith login failed: {response.text}")
    
    # Test with admin123 (your attempt)
    print("\n3. Testing admin123 / admin666 (your attempt)")
    response = requests.post('http://localhost:8000/api/auth/login/', 
                           json={'username': 'admin123', 'password': 'admin666'})
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        print("✅ admin123 login successful!")
    else:
        print(f"❌ admin123 login failed: {response.text}")
    
    print("\n=== SOLUTION ===")
    print("Use these VALID credentials to login:")
    print("Username: johndoe")
    print("Password: password123")
    print("OR")
    print("Username: janesmith")
    print("Password: password123")

if __name__ == "__main__":
    test_login_credentials() 