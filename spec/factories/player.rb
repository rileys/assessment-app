# frozen_string_literal: true

FactoryBot.define do
  factory :player do
    sequence(:name) { |n| "Player #{n}" }

    team
  end
end
