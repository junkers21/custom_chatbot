class LangChain::App

  def self.hello_world
    params = {
      param1: "test 1",
      param2: "test 2",
    }

    output = LangChain::App.exec_py_cmd('hello.py', params )
    parsed = JSON.parse(output)
    puts parsed["other_data"]
  end

  def self.update_vector_database
    params = LangChain::App.set_params({ website_to_parse: "https://isee-u.fr/sitemap_index.xml" })
    LangChain::App.exec_py_cmd('updateDB.py', params )
  end

  def self.ask_question(input)
    params = LangChain::App.set_params({ input: input })
    output = LangChain::App.exec_py_cmd('inputQA.py', params )
    puts output
  end

  def self.chat( input, conversation )
    params = LangChain::App.set_params({ input: input, conversation: conversation })
    output = LangChain::App.exec_py_cmd('chat.py', params )
    output
  end

  def self.exec_py_cmd(file, params)
    cmd_params = LangChain::App.set_as_cmd_params( params )
    cmd = "python3 #{LangChain::App.route_to_py}/#{file} #{cmd_params}"
    `#{cmd}`
  end

  def self.route_to_py
    Rails.root.join('app', 'utils', 'lang_chain', 'py' )
  end

  def self.set_as_cmd_params( hash )
    cmd_params = ""
    hash.each do |param|
      cmd_params += "--#{param[0]}=#{Shellwords.escape(param[1])} "
    end
    cmd_params
  end

  def self.set_params( params )
    params.merge({
                   qdrant_url: Rails.application.credentials.dig(:qdrant_url),
                   qdrant_key: Rails.application.credentials.dig(:qdrant_key),
                   openai_key: Rails.application.credentials.dig(:openai_key)
                 })
  end

end