class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.string :username
      t.string :password
      t.string :name
      t.string :email
      t.string :gender
      t.string :address
      t.string :phone_number
      t.float :latitude
      t.float :longitude
      t.timestamps
    end
  end
end
