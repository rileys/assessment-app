# frozen_string_literal: true

FactoryBot.define do
  factory :team do
    conference

    trait :with_players do
      transient do
        number { 1 }
      end
      after(:build) do |team, evaluator|
        evaluator.number.times do
          team.players << build(:player)
        end
      end
    end
  end
end
