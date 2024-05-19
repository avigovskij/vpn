#ansible-playbook -i ./.parameters/inventory.yml -v playbooks/configure_ca.yml
#ansible-playbook -i ./.parameters/inventory.yml -v playbooks/configure_server.yml
ansible-playbook -i ./.parameters/inventory.yml -v playbooks/configure_client.yml
