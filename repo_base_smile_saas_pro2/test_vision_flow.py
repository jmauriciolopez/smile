import requests
import json

def test_vision_service():
    url = "http://localhost:8000/analizar"
    headers = {
        "X-API-KEY": "smile_dev_master_key_2026_qwert"
    }
    
    # Mock de imagen (en un caso real sería un archivo binario)
    # Por ahora el microservicio espera un UploadFile
    files = {
        'file': ('test.jpg', b'fake-image-content', 'image/jpeg')
    }

    print(f"Probando conexión con Vision Service en {url}...")
    try:
        response = requests.post(url, headers=headers, files=files)
        print(f"Status Code: {response.status_code}")
        if response.status_code == 200:
            print("¡ÉXITO! El flujo de IA respondió correctamente.")
            print("Respuesta:", json.dumps(response.json(), indent=2))
        else:
            print(f"ERROR: El servicio respondió con {response.status_code}")
            print("Detalle:", response.text)
    except Exception as e:
        print(f"ERROR DE CONEXIÓN: {str(e)}")

if __name__ == "__main__":
    test_vision_service()
