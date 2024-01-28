class Exchange < ApplicationRecord
  belongs_to :conversation

  def get_answer
    self.output = LangChain::App.chat(input, get_history)
    save
  end

  def get_history
    Exchange.where(conversation_id: conversation_id).order(created_at: :asc).to_json( only: [:input, :output] )
  end
end
