"""
Base Station for the MiniBot.
"""

# external
from random import choice
from string import digits, ascii_lowercase, ascii_uppercase

# internal
# from connection.base_connection import BaseConnection
from bot.base_station_bot import BaseStationBot as BSBot
from session.session import Session
from playground.playground import Playground

class BaseStation:
    def __init__(self):
        self.active_bots = {}
        self.active_sessions = {}
        self.active_playgrounds = {}
        # self.connections = BaseConnection()

    # ==================== ID GENERATOR ====================

    def generate_id(self):
        """
        Generates a unique 5 character id composed of digits, lowercase, 
        and uppercase letters.
        """
        chars = digits + ascii_lowercase + ascii_uppercase
        unique_id = "".join([choice(chars) for i in range(5)])
        return unique_id

    # ==================== BOTS ====================

    def list_active_bots_names(self):
        """
        Returns a list of the Bot IDs.

        Returns:
            (list<str>): List of IDs of all active bots.
        """
        return list(self.active_bots.keys())

    def add_bot(self, bot_id, port, type, ip=None):
        """
        Adds a bot to the list of active bots, if the connection
        is established successfully.

        Args:
            bot_id (str):
            ip (str):
            port (int):
        """
        if type == "PIBOT":
            new_bot = PiBot()
        elif type == "SIMBOT":
            new_bot = SimBot()

        if new_bot.is_active():
            return new_bot.get_id()
        else:
            del new_bot
            raise Exception("The connection was not active. Not adding the "
                            + "bot.")

    def remove_bot(self, bot_id):
        """
        Removes minibot from list of active bots by name.

        Args:
            bot_id (str):
        """
        del self.active_bots[bot_id]
        return bot_id not in self.active_bots

    def get_bot(self, bot_id):
        return self.active_bots[bot_id]

    def discover_bots(self):
        pass

    def set_position_of_bot(self, bot_id, pos):
        pass

    # ================== SESSIONS ==================

    def list_active_sessions(self):
        """
        Returns all of the session_id in active_sessions

        Returns:
            list : list of session_id
        """
        return self.active_sessions.keys()

    def has_session(self, session_id):
        """
        Returns True if session_id exists in active_sessions

        Returns:
            boolean
        """
        return session_id in self.active_sessions

    def add_session(self):
        """
        Adds a new session to active_sessions

        Returns:
            session_id (str): a unique id
        """
        session_id = self.generate_id()
        self.active_sessions[session_id] = Session(session_id)
        return session_id

    def remove_session(self, session_id):
        """
        Removes a session from active_sessions

        Argss:
            session_id (str): a unique id
        """
        del self.active_sessions[session_id]
        return session_id not in self.active_sessions

    def add_bot_to_session(self, session_id, bot_id):
        if bot_id not in self.active_bots:
            raise Exception("Bot is not active. Failed to add bot" + bot_id + " to session " + session_id)
        bot = self.active_bots[bot_id]
        return self.active_sessions[session_id].add_bot_id_to_session(bot.get_id())

    # ================== PLAYGROUND ==================

    def add_playground(self, session_id, is_private):
        """
        Adds a new playground to active_playgrounds

        Returns:
            playground_id (str): a unique id
        """
        playground_id = self.generate_id()
        self.active_playgrounds[playground_id] = Playground(session_id, playground_id, is_private)
        return playground_id

    def remove_playground(self, playground_id):
        """
        Removes a playground from active_playgrounds

        Returns:
            id of removed playground
        """
        del self.active_playgrounds[playground_id]
        return playground_id not in self.active_playgrounds

    def add_bot_to_playground(self, playground_id, bot_id):
        """
        Adds bot to playground. If playground is private, ensures that there
        is only one bot

        Returns:
            list of bots in specific playground
        """
        #checks that bot is in list of bots
        if bot_id not in self.active_bots:
            raise Exception("Bot is not active. Failed to add bot" + bot_id + " to playground " + playground_id)

        #TODO: check bot is a simbot
        if not isinstance(self.active_bots[bot_id], Simbot):
            raise Exception("Bot " + bot_id + " is not a Simbot")

        playground = self.active_playgrounds[playground_id]
        
        #if playground is private
        if playground.is_private():
            if playground.bots.size() == 1:
                raise Exception("There is already a bot in playground " + playground_id)
            else:
                playground.add_bot(bot_id)

        #if playground is public
        else:
            playground.add_bot(bot_id)

