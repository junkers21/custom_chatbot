class Conversation < ApplicationRecord
  has_many :exchanges, dependent: :destroy

  def hr_title
    title
  end
end
