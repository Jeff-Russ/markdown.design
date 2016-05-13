class CreateShareLinks < ActiveRecord::Migration
  def self.up
    create_table :share_links do |t|
      t.string :emails
      t.string :link_token
      t.datetime :link_expires_at
      t.references :user_file
      t.timestamps
    end
  end

  def self.down
    drop_table :share_links
  end
end

# rails g model ShareLinks email:string link_token:string link_expires_at:datetime user_file:reference message:text user_id:integer