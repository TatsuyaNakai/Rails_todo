class ApplicationController < ActionController::Base
  protect_from_forgery with: :null_session
  # おまじないやと思うべき。API通信をするときにここに貼り付ける。
end
