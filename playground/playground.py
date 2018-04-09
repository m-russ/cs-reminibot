"""
Class which represents the virtual environment for virtual bots
"""

#TODO: make scenario object class for static objects
#TODO: make physics class

class Playground():
    def __init__(self, session_id, playground_id, is_private):
        self.name = ""
        self.playground_id = playground_id
        self.session_id = session_id
        self.is_active = True
        self.is_private = is_private
        self.scenario = {}
        self.bots = {}

    def get_session_id(self):
        return self.session_id

    def set_playground_name(self, name):
        self.name = name

    def get_playground_id(self):
        return self.playground_id

    def is_active(self):
        return self.is_active;

    def is_private(self):
        return self.is_private

    def add_scenario(self, scenario_object):
         self.scenario.append(scenario_object)

    def add_bot(self, bot):
        self.bots.append(bot)

    #TODO: simbot class - move function!
    def move_simbot(self, direction):
        if self.is_private:
            #apply physics to direction
            #self.bots[0].move(direction)
            pass