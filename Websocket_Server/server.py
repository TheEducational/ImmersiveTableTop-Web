import asyncio
import websockets

async def ping_pong(websocket, path):
    while True:
        # Send a ping message
        await websocket.send("ping")
        print("Connection Open With Client")
        
        # Wait for the pong response
        try:
            while True:
                try:
                    pong = await asyncio.wait_for(websocket.recv(), timeout=2)
                    if pong == "pong":
                        print("Received: pong")
                    else:
                        print("Received unexpected message:", pong)
                except websockets.ConnectionClosedOK:
                    print("Client Dropped")
                    return
                except asyncio.TimeoutError:
                    print("No pong received, closing connection.")
                    break
                await asyncio.sleep(1)  # Wait before sending the next ping
                
        finally:
            print("Conn Closed")

async def main():
    async with websockets.serve(ping_pong, "localhost", 6969):
        print("Server started on ws://localhost:6969")
        await asyncio.Future()  # Run forever

if __name__ == "__main__":
    asyncio.run(main())
