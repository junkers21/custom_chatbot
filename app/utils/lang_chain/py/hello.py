import argparse
import json

parser = argparse.ArgumentParser()
parser.add_argument('--param1', type=str, help='First param')
parser.add_argument('--param2', type=str, help='Second param')
args = parser.parse_args()

param1_value = args.param1
param2_value = args.param2

result = {
    "param1": param1_value,
    "param2": param2_value,
    "other_data": "This is some result data from the script."
}

print(json.dumps(result))