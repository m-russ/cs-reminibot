"""
Object which represents the Pi bot (physical minibot).
Extends Bot class.
"""

from connection.tcp_connection import TCPConnection
from basestation.bot.bot import Bot
import threading

class PiBot(Bot):
    def __init__(self, bot_id, name, ip, port=10000):
        super(self).__init__(id, name)
        self.port = port
        self.ip = ip

        self.tcp_connection = TCPConnection(ip, port=port)

        self.tcp_listener_thread = self.TCPListener(self.tcp_connection)
        self.tcp_listener_thread.start()

    def __del__(self):
        self.tcp_connection.destroy()

    def get_id(self):
        return self.id

    def get_ip(self):
        return self.ip

    def is_active(self):
        return self.tcp_connection.is_connection_active()

class TCPListener(threading.thread):
    def __init__(self, t):
        super().__init__()
        self.tcp_connection_obj = t
    def run(self):
        try:
            while True:
                if self.tcp_connection_obj.is_connection_active():
                    msg = self.tcp_connection_obj.receive()
                    if msg is not None:
                        self.tcp_parse_incoming(msg)
        except RuntimeError as e:
            msg = "TCP receive message failed."
            log_exn_info(e, msg = msg)

    def tcp_parse_incoming(self, data):
        start = data.find("<<<<")
        comma = data.find(",")
        end = data.find(">>>>")
        if start != -1 and comma != -1 and end != -1:
            key = data[start+4: comma]
            value = data[comma + 1: end]



# Add TCP_ACT_ON_INCOMING

