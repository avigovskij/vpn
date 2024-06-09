# VPNaaS VPN as a service
Данный сервис представляет возможность развернуть VPN сеть со следующими компонентами:
* CA - центр сертификации
* OpenVPN Сервер – сервер, осуществляющий подключение пользователей для поддержания протокола openvpn

Для того, чтобы пользователь мог получить доступ к инфраструктуре VPN, ему необходимо произвести транзакцию на TON-кошелек, после чего будет выполнен
деплой нового смарт-контракта, который по завершению обработки сервером, будет иметь содержимое .ovpn файла в формате base64.

## Развертывание VPN и поддержание инфраструктуры
Для развертывания и поддержания инфраструктуры используется [Ansible](https://docs.ansible.com/ansible/latest/index.html).
Для того, чтобы поддерживать инфраструктуру, были написаны 3 плейбука:
* [configure_ca.yml](/ansible/playbooks/configure_ca.yml) – Производит настрофка центра сертификации (CA)
* [configure_server.yml](/ansible/playbooks/configure_server.yml) – Производит конфигурацию OVPN сервера
* [configure_client.yml](/ansible/playbooks/configure_client.yml) – Производит создание запроса на сертификат и его подписание на стороне CA

Пример команд для ручного запуска плейбуков:
```shell
ansible-playbook -i ./.parameters/inventory.yml -v playbooks/configure_ca.yml
ansible-playbook -i ./.parameters/inventory.yml -v playbooks/configure_server.yml
ansible-playbook -i ./.parameters/inventory.yml -v playbooks/configure_client.yml
```

## API
Для реализации API используется NodeJS со следующими зависимостями и библиотеками:
* [ws]() – Для создания WebSocket сервера
* [express]() – Для создания HTTP сервера
* [@tonconnect/sdk]() – Для аутентификации пользовательского кошелька
* [@@ton/ton]() – Для взаимодействия с блокчейном TON
Исходный код API с развертыванием серверо находится в [директории](/vpnaaspayment/api/src).

## BlockChain
Для реализации BlockChain составляющей была реализована система хранения с генерацией новых смарт-контрактов для хранения данных.
Более подробно о реализации смарт-контарктов в [README.md.ru](/vpnaaspayment/contracts/README.ru.md)

## Frontend
Клиентская часть приложения реализована с использованием фреймворка ReactJS и представляет из себя Client-side-rendering приложение.
Исходный код находится в [директории](/frontend)

