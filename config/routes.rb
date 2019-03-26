Rails.application.routes.draw do
  resources :conferences do
    resources :teams do
      resources :players
    end
  end

  resources :teams do
    resources :players, only: :index
  end

  resources :players

  root 'conferences#show'
end
