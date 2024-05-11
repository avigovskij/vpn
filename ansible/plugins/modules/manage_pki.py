#!/usr/bin/python

# Copyright: (c) 2018, Terry Jones <terry.jones@example.org>
# GNU General Public License v3.0+ (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
from __future__ import (absolute_import, division, print_function)
__metaclass__ = type

import os
import re

DOCUMENTATION = r'''
---

'''

EXAMPLES = r'''

'''

RETURN = r'''

'''

from ansible.module_utils.basic import AnsibleModule


class EasyRsaClient(object):
    """Class that represents client for easyrsa binary file"""

    def __init__(self, ansible_module, easy_rsa_home):
        """
        Initializer method for easyrsa client
        :param ansible_module: AnsibleModule
        :param easy_rsa_home: str - path to easyrsa folder
        """
        self._ansible_module = ansible_module
        self._easy_rsa_home = easy_rsa_home
        os.environ['EASYRSA'] = self._easy_rsa_home

    def get_info(self):
        """Method that returns information about easyrsa configuration"""
        command = '%s/easyrsa' % self._easy_rsa_home

        rc, std_out, std_err = self._ansible_module.run_command(command)

        if rc != 0:
            raise Exception('Command %s failed! RC: %d. STDOUT: %s. STDERR: %s' % (command, rc, std_out, std_err))
        else:
            result = {
                'EASYRSA': None,
                'PKI': None,
                'vars-file': None,
                'CA status': False
            }

            file_based_parameters = ('EASYRSA', 'PKI', 'vars-file')

            for file_type in file_based_parameters:
                pattern = r'%s:\s*(?P<path>[\w\/\.]*)' % file_type
                for stdout_line in std_out.split('\n'):
                    search_object = re.search(pattern=pattern, string=stdout_line)
                    if search_object:
                       result[file_type] = search_object.group('path')

            for stdout_line in std_out.split('\n'):
                if stdout_line == 'CA status: OK':
                    result['CA status'] = True

        return result

    def get_certificate_info(self, name):
        """
        :param request_name:
        :return:
        """
        rc, std_out, std_err = self._ansible_module.run_command('$EASYRSA/easyrsa show-cert %s' % name)

        result = {'file_path': None}
        if rc == 0:
            for std_out_line in std_out.split('\n'):
                file_pattern_match = r'\*\s*(?P<path>[\w\/\.]+\.crt)'
                search_result = re.search(pattern=file_pattern_match, string=std_out_line)
                if search_result:
                    result['file_path'] = search_result.group('path')
                    break

        return result

    def get_request_info(self, name):
        """"""
        """
        :param request_name:
        :return:
        """
        rc, std_out, std_err = self._ansible_module.run_command('$EASYRSA/easyrsa show-req %s' % name)

        result = {'file_path': None}
        if rc == 0:
            for std_out_line in std_out.split('\n'):
                file_pattern_match = r'\*\s*(?P<path>[\w\/\.]+\.req)'
                search_result = re.search(pattern=file_pattern_match, string=std_out_line)
                if search_result:
                    result['file_path'] = search_result.group('path')
                    break

        return result

    def generate_request(self, request_name):
        """Method that generates request for certificate"""
        os.environ['EASYRSA_BATCH'] = 'yes'
        command = '$EASYRSA/easyrsa gen-req %s nopass' % request_name
        rc, std_out, std_err = self._ansible_module.run_command(command)

        if rc != 0:
            raise Exception('Command %s failed! RC: %d. STDOUT: %s. STDERR: %s' % (command, rc, std_out, std_err))
        else:
            result = {'request': None, 'key': None}
            for std_out_line in std_out.split('\n'):
                req_file_regex = r'req: (?P<path>[\w\/\.]*)'
                key_file_regex = r'key: (?P<path>[\w\/\.]*)'

                for file_type, file_regex in {'request': req_file_regex, 'key': key_file_regex}.items():
                    search_object = re.search(pattern=file_regex, string=std_out_line)
                    if search_object:
                        result[file_type] = search_object.group('path')

            if None in result.values():
                raise Exception('result: %s' % std_out)
        return result

    def sign_request(self, request_type, request_name):
        """
        Method that imports and signs request for certificate
        Method should be idempotent, so request will be deleted before
        """
        os.environ['EASYRSA_BATCH'] = 'yes'
        # Check if request_name already processed
        request_path = self.get_request_info(name=request_name).get('file_path')

        if request_path:
            os.remove(path=request_path)

        command = '$EASYRSA/easyrsa import-req /tmp/%s.req %s' % (request_name, request_name)
        rc, std_out, std_err = self._ansible_module.run_command(command)
        if rc != 0:
            raise Exception(
                "%s request wasn't signed! RC: %d | STDOUT was: %s | STDERR: %s" % (
                    request_name, rc,
                    std_out, std_err
                )
            )

        certificate_path = self.get_certificate_info(name=request_name).get('file_path')

        if certificate_path:
            os.remove(path=certificate_path)

        command = '$EASYRSA/easyrsa sign-req %s %s' % (request_type, request_name)
        sign_req_rc, sign_req_std_out, sign_req_std_err = self._ansible_module.run_command(command)

        if sign_req_rc != 0:
            raise Exception(
                'Request signification failed! Command: "%s" | RC: %d | STDOUT: %s | STDERR: %s' % (
                    command,
                    sign_req_rc,
                    sign_req_std_out,
                    sign_req_std_err
                )
            )


def run_module():
    # define available arguments/parameters a user can pass to the module
    module_args = dict(
        name=dict(type='str', required=False),
        rsa_home=dict(type='str', required=True),
        state=dict(type='str', choice=['request'], default='request'),
        request_type=dict(type='str', choice=['client', 'server'])
    )

    ansible_module = AnsibleModule(argument_spec=module_args)

    easy_rsa_client = EasyRsaClient(
        ansible_module=ansible_module,
        easy_rsa_home=ansible_module.params['rsa_home'],
    )

    try:
        if ansible_module.params['state'] == 'request':
            result = easy_rsa_client.generate_request(
                request_name=ansible_module.params['name'],
            )
        elif ansible_module.params['state'] == 'info':
            result = easy_rsa_client.get_info()
        elif ansible_module.params['state'] == 'sign':
            if not 'request_type' in ansible_module.params:
                raise Exception('state == sign but request_type is not specified!')
            result = easy_rsa_client.sign_request(
                request_type=ansible_module.params['request_type'],
                request_name=ansible_module.params['name']
            )
    except Exception as exception:
        ansible_module.fail_json(
            msg={'exc': str(exception)}
        )
    else:
        ansible_module.exit_json(
            result=result
        )


def main():
    run_module()


if __name__ == '__main__':
    main()