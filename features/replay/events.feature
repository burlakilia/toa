Feature: Event samples

  Scenario: `Created` event sample is passing
    Given I have a sample for `transit` operation of `tea.pots`:
      """yaml
      title: Should emit event
      input:
        material: glass
        volume: 1.5
      next:
        material: glass
        volume: 1.5
      events:
        created:
          material: glass
          volume: 1.5
      """
    When I replay it
    Then it passes
