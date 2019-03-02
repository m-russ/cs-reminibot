import io
import socket
import struct
import cv2

server = socket.socket()
server.bind(("", 8080))
print("port 8989 is open")
server.listen(0)
connection = server.accept()[0].makefile("rb")

try:
    while True:
        image_len = struct.unpack("<L", connection.read(struct.calcsize("<L")))[0]
        if not image_len:
            break
        image_stream = io.BytesIO()
        image_stream.write(connection.read(image_len))
        image_stream.seek(0)
        image = cv2.imdecode(image_stream, cv2.IMREAD_COLOR)
        if image is None:
            raise ValueError
finally:
    connection.close()
    server.close()

