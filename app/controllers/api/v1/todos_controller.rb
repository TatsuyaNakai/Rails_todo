class Api::V1::TodosController < ApplicationController
  def index
    todos= Todo.order(update_at: :desc)
    # 更新日付が大きい順、新しいものが上にくるように並べる
    render json: todos
    # json形式で情報を渡してあげること
  end

  def show
    todo=Todo.find(params[:id])
    render json:todo
  end

  def create
    todo=Todo.new(todo_params)
    if todo.save
      render json: todo
    else
      render json: todo.errors, status: 422
      # オブジェクトの変更がうまくできてない時に使われる。これがなんの時に生きるのかわからん。
    end
  end

  def update
    todo=Todo.find(params[:id])
    if todo.update(todo_params)
      render json: todo
    else
      render json: todo.errors, status: 422
    end
  end

  def destroy
    if Todo.destroy(params[:id])
      head :no_content
      # 通信としては成功してるけど、特に何かを変えるわけじゃない。JSXでSPAで任せる時に使う。
    else
      render json: { error: "Failed to destroy" }, status: 422
    end
  end

  def destroy_all
    if Todo.destroy_all
      head :no_content
    else
      render json: { error: "Failed to destroy" }, status: 422
    end
  end

  # ---------------------------------------------------------------
  private

  def todo_params
    params.require(:todo).permit(:name, :is_completed)
  end

end