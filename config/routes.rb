Rails.application.routes.draw do
  resources :conversations, except: [:edit, :new]
  resources :exchanges, only: [:index, :show, :create]
  root "conversations#index"
end
