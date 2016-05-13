class Permission < ActiveRecord::Base
  belongs_to :folder
  belongs_to :group
end
