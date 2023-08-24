class ExchangesController < ApplicationController
  before_action :set_exchange, only: %i[ show ]

  # GET /conversations or /conversations.json
  def index
    @exchanges = Exchange.where(conversation_id: params[:id]).order(created_at: :asc)
  end

  # GET /exchanges/1 or /exchanges/1.json
  def show
  end

  # POST /exchanges or /exchanges.json
  def create
    @exchange = Exchange.new(exchange_params)

    if @exchange.save
      render partial: 'exchanges/exchange', status: :created, locals: { exchange: @exchange }, layout: false
    else
      render json: @exchange.errors, status: :unprocessable_entity
    end
  end

  private
  # Use callbacks to share common setup or constraints between actions.
  def set_exchange
    @exchange = Exchange.find(params[:id])
  end

  # Only allow a list of trusted parameters through.
  def exchange_params
    params.require(:exchange).permit(:input, :conversation_id)
  end

end
