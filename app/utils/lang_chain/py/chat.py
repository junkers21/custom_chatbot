from langchain.schema import retriever
from langchain.chains import RetrievalQA
from langchain.llms import OpenAI
from langchain.vectorstores import Qdrant
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.memory import ConversationSummaryMemory
from langchain.chat_models import ChatOpenAI
from langchain.chains import ConversationalRetrievalChain
import argparse
import qdrant_client
import json
import os

# Start
parser = argparse.ArgumentParser()
parser.add_argument('--input', type=str, help='Input question')
parser.add_argument('--conversation', type=json.loads, help='Conversation array')
parser.add_argument('--qdrant_url', type=str, help='Quadrant URL')
parser.add_argument('--qdrant_key', type=str, help='Quadrant API key')
parser.add_argument('--openai_key', type=str, help='Open AI API key')
args = parser.parse_args()

os.environ['OPENAI_API_KEY'] = args.openai_key
llm = OpenAI(temperature=0)
memory = ConversationSummaryMemory(llm=llm,memory_key="chat_history",return_messages=True)

for c in args.conversation:
    if c['input'] is not None and c['output'] is not None:
        memory.save_context({"input": c['input']},{"output": c['output']})

client = qdrant_client.QdrantClient(
    args.qdrant_url,
    api_key=args.qdrant_key
)

embeddings = OpenAIEmbeddings()
qdrant = Qdrant(
    client=client,
    embeddings=embeddings,
    collection_name='custom_bot'
)

query = args.input
llm = ChatOpenAI()
retriever = qdrant.as_retriever(search_kwargs={'k': 3})
qa = ConversationalRetrievalChain.from_llm(llm, retriever=retriever, memory=memory)

response = qa(query)
print( response['answer'] )