Feature: Back pressure handling

  Background:
    Given an active connection to the broker

  Scenario: Flooding a queue
    Given function replying `flood` queue:
    """
    () => { return new Buffer.from('ok') }
    """
    When I'm sending 20kB requests to the `flood` queue at 5kHz for 0.5 seconds
    Then back pressure was applied
