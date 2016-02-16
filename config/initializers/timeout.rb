Rack::Timeout.timeout = 20  # seconds

# silence excessive logging for rack-timeout
Rack::Timeout.unregister_state_change_observer(:logger) if Rails.env.development?