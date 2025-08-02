import requests
import time

def test_api():
    print("Testing API endpoints...")
    time.sleep(2)  # Wait for server to start
    
    try:
        # Test API root
        response = requests.get('http://localhost:8000/api/')
        print(f'API Root Status: {response.status_code}')
        if response.status_code == 200:
            data = response.json()
            print("✅ API Root working!")
            print(f"Message: {data.get('message', 'N/A')}")
        else:
            print("❌ API Root failed")
            
        # Test posts endpoint
        response2 = requests.get('http://localhost:8000/api/posts/')
        print(f'Posts Status: {response2.status_code}')
        if response2.status_code == 200:
            data = response2.json()
            posts = data.get('results', [])
            print(f"✅ Posts endpoint working! Found {len(posts)} posts")
        else:
            print("❌ Posts endpoint failed")
            
        # Test categories endpoint
        response3 = requests.get('http://localhost:8000/api/categories/')
        print(f'Categories Status: {response3.status_code}')
        if response3.status_code == 200:
            print("✅ Categories endpoint working!")
        else:
            print("❌ Categories endpoint failed")
            
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to Django server. Make sure it's running on localhost:8000")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_api() 