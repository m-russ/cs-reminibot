"""
Object which represents the Pi bot (physical minibot).
Extends Bot class.
"""

from connection.tcp_connection import TCPConnection
from basestation.bot.bot import Bot

class PiBot(Bot):
    def __init__(self, bot_id, name, ip, port=10000):
        super(self).__init__(id, name)
        self.port = port
        self.ip = ip

        self.tcp_connection = TCPConnection(ip, port=port)

    def get_id(self):
        return self.id

    def get_ip(self):
        return self.ip

    def is_active(self):
        return self.tcp_connection.is_connection_active()