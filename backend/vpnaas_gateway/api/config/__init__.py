import os

import yaml


VPN_GW_CONFIG = {}


with open(os.environ['API_GW_CONFIG_PATH']) as configuration_file:
    VPN_GW_CONFIG = yaml.safe_load(configuration_file)
