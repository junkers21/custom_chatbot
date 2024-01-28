from langchain.schema import retriever
from langchain.chains import RetrievalQA
from langchain.llms import OpenAI
from langchain.vectorstores import Qdrant
from langchain.embeddings.openai import OpenAIEmbeddings
import argparse
import qdrant_client
import os

# Start
parser = argparse.ArgumentParser()
parser.add_argument('--input', type=str, help='Input question')
parser.add_argument('--qdrant_url', type=str, help='Quadrant URL')
parser.add_argument('--qdrant_key', type=str, help='Quadrant API key')
parser.add_argument('--openai_key', type=str, help='Open AI API key')
args = parser.parse_args()


client = qdrant_client.QdrantClient(
    args.qdrant_url,
    api_key=args.qdrant_key
)

os.environ['OPENAI_API_KEY'] = args.openai_key
embeddings = OpenAIEmbeddings()
qdrant = Qdrant(
    client=client,
    embeddings=embeddings,
    collection_name='custom_bot'
)

query = args.input
qa = RetrievalQA.from_chain_type(
    llm=OpenAI(),
    chain_type='stuff',
    retriever=qdrant.as_retriever(search_kwargs={'k': 3})
)

response = qa.run(query)
print( response )