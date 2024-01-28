import argparse
import json
from bs4 import BeautifulSoup
import os
from langchain.document_loaders.sitemap import SitemapLoader
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.vectorstores import Qdrant
import qdrant_client


def remove_nav_and_header_elements(content: BeautifulSoup) -> str:
    # Find all 'nav' and 'header' elements in the BeautifulSoup object
    nav_elements = content.find_all("nav")
    header_elements = content.find_all("header")

    # Remove each 'nav' and 'header' element from the BeautifulSoup object
    for element in nav_elements + header_elements:
        element.decompose()

    return str(content.get_text())

# Start
parser = argparse.ArgumentParser()
parser.add_argument('--website_to_parse', type=str, help='Website Sitemap To Parse URL')
parser.add_argument('--qdrant_url', type=str, help='Quadrant URL')
parser.add_argument('--qdrant_key', type=str, help='Quadrant API key')
parser.add_argument('--openai_key', type=str, help='Open AI API key')
args = parser.parse_args()

os.environ['OPENAI_API_KEY'] = args.openai_key

sitemap_loader = SitemapLoader(
    web_path=args.website_to_parse,
    parsing_function=remove_nav_and_header_elements,
    filter_urls=["^(?!.*elementor-|#).*$"]
)
sitemap_loader.max_docs_per_page = 100
sitemap_loader.overlap_docs_per_page = 25
sitemap_loader.requests_per_second = 2
sitemap_loader.requests_kwargs = { "verify": False }
docs = sitemap_loader.load()

embeddings = OpenAIEmbeddings()
qdrant = Qdrant.from_documents(
    docs,
    embeddings,
    url=args.qdrant_url,
    api_key=args.qdrant_key,
    prefer_grpc=True,
    collection_name='custom_bot',
    force_recreate=True,
)
