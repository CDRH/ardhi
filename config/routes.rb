Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  get '/map', to: 'items#map', as: 'map'
  get '/timeline', to: 'general#timeline', as: 'timeline'

  # Temporary until this gets moved to its own site

  get '/dh_roundtable', to: 'general#dhroundtable', as: 'dhroundtable'

end
