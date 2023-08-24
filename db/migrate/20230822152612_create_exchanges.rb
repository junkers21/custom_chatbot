class CreateExchanges < ActiveRecord::Migration[7.0]
  def change
    create_table :exchanges do |t|
      t.references :conversation, null: false, foreign_key: true
      t.text :input
      t.text :output

      t.timestamps
    end
  end
end
