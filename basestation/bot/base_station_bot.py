"""
Base Station Bot.
"""
class BaseStationBot:
    def __init__(self, bot_id, name):
        self.id = bot_id
        self.name = name

    def __del__(self):
        pass

    def get_id(self):
        return self.id

    def get_name(self):
        return self.name