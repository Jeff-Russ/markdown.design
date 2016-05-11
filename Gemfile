source 'https://rubygems.org'

ruby '2.2.4'

gem 'rails' ,"4.2.5"  # Bundle edge Rails instead: gem 'rails'

, group: [:development, :test]
# Use postgresql as the database for production
group :production do
  gem 'pg'
  gem 'rails_12factor' 
  gem 'newrelic_rpm'   # to keep app awake
  gem 'puma'         # the server, replaced 'unicorn'
  gem 'rack-timeout'
end

group :development do
  # Access an IRB console on exception pages or by using <%= console %> in views
  gem 'web-console', '~> 2.0'
  gem 'spring'   # speeds up dev by keeping your app running in the bg. 
  gem 'sqlite3'  # Use sqlite3 as the database for Active Record
end

group :development, :test do
  # Call 'byebug' to stop execution and debug to console
  gem 'byebug'
  # gem 'capistrano-rails'
end

# bundle exec rake doc:rails generates the API under doc/api.
gem 'sdoc', '~> 0.4.0', group: :doc

gem 'coffee-rails', '~> 4.1.0' # For .coffee assets and views
gem 'sass-rails', '~> 5.0'     # Use SCSS for stylesheets

gem 'jquery-rails'         # The JavaScript library
gem 'bootstrap-sass'       #  bootstrap library for styles
gem 'font-awesome-sass'    # A Library for icons
gem 'uglifier', '>= 1.3.0' # Compressor for JavaScript assets
gem 'jbuilder', '~> 2.0'   # Build JSON APIs with ease

# gem 'bcrypt', '~> 3.1.7'   # Use ActiveModel has_secure_password
# gem 'turbolinks'           # Makes links in your web app faster
# gem 'devise'               # Use devise for user auth
# gem 'figaro'               # Use figaro to hide secret keys
# gem 'sprockets-rails', '2.3.3'

gem 'paperclip'  # Use paperclip for image uploads
gem 'aws-sdk-v1' # For AWS S3 service If paperclip <= v4.3.1
gem 'redcarpet', '~> 2.1.1' # for markdown support, not 'reverse_markdown'
gem 'coderay', '~> 1.0.7'   # for markdown support

# equivalent for secrets.yml of that Figaro
# gem 'heroku_secrets', github: 'alexpeattie/heroku_secrets'  # rake heroku:secrets RAILS_ENV=production


