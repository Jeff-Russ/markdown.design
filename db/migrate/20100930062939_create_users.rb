class CreateUsers < ActiveRecord::Migration
  def self.up
    create_table :users do |t|
      t.string :name
      t.string :email
      t.string :hashed_password
      t.string :password_salt
      t.string :is_admin
      t.string :access_key
      t.string :remember_token
      t.string :reset_password_token
      t.datetime :reset_password_token_expires_at
      t.timestamps
    end
  end

  def self.down
    drop_table :users
  end
end

# rails g model User name:string email:string hashed_password:string password_salt:string is_admin:boolean remember_token:string reset_password_token:string reset_password_token_expires_at:datetime signup_token:string signup_token:index signup_token_expires_at:datetime
# dropped access_key:string