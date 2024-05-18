import os


class AnsibleRunner:
    """Class that represents logic for integration with ansible"""
    def __init__(self, ansible_cfg_path: str):
        """"""
        self._ansible_cfg_path = ansible_cfg_path

    def run_playbook(self, inventory_path, playbook_path):
        """"""
        os.system(f'ansible-playbook -i {inventory_path} -v {playbook_path}')

