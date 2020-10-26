Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  get '/map', to: 'items#map', as: 'map'
  get '/timeline', to: 'general#timeline', as: 'timeline'

end
