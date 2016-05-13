class CreatePermissions < ActiveRecord::Migration
  def self.up
    create_table :permissions do |t|
      t.references :folder
      t.references :group
      t.boolean :can_create
      t.boolean :can_read
      t.boolean :can_update
      t.boolean :can_delete
    end
  end

  def self.down
    drop_table :permissions
  end
end

# rails g model Permission folder:references group:references can_create:boolean can_read:boolean can_update:boolean can_delete:boolean