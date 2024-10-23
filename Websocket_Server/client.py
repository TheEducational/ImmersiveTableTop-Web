import asyncio
import websockets

async def client():
    uri = "ws://localhost:6969"
    async with websockets.connect(uri) as websocket:
        print("Connected to the server")

        while True:
            # Wait for a message from the server
            try:
                message = await asyncio.wait_for(websocket.recv(), timeout=2)
                print("Received:", message)
                if message == "ping":
                    await websocket.send("pong")
                    print("Sent: pong")
            except asyncio.TimeoutError:
                print("No message received, waiting...")
            except websockets.ConnectionClosed:
                print("Connection closed by the server.")
                break

if __name__ == "__main__":
    asyncio.run(client())
