# PlantaPet

Sistema de irrigação inteligente para plantas, desenvolvido para monitorar a umidade do solo e integrar sensores físicos a uma aplicação web.

## Tecnologias utilizadas

### Front-end

* React
* Vite
* JavaScript
* CSS

### IoT e automação

* ESP32
* Arduino IDE
* Sensor de umidade do solo
* MQTT

### Comunicação

O ESP32 realiza a leitura da umidade do solo e envia os dados através do protocolo MQTT para o sistema.

## Funcionamento

1. O sensor de umidade realiza a leitura do solo.
2. O ESP32 processa a leitura e converte o valor para porcentagem.
3. O ESP32 publica os dados através do MQTT.
4. A aplicação Plantapet recebe e apresenta as informações de umidade.
5. O sistema permite acompanhar o estado da planta através da interface web.

## Hardware

* ESP32
* Sensor de umidade do solo
* Computador para desenvolvimento
* Arduino IDE

## MQTT

O ESP32 utiliza MQTT para comunicação com o broker.

Tópico utilizado no projeto:

`PSA/Executivo/AutomacaoPredial/irrigador/jardineira1`

## Objetivo

Criar um sistema de monitoramento e irrigação inteligente, integrando desenvolvimento web, Internet das Coisas (IoT) e automação.
