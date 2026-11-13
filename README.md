PLANTAPET

O PlantaPet é um projeto que desenvolvi com o objetivo de utilizar a tecnologia para facilitar o cuidado e o monitoramento de plantas.

A aplicação permite cadastrar usuários, registrar plantas, acompanhar a umidade do solo, controlar a irrigação, consultar informações por meio de inteligência artificial e visualizar a localização das plantas em um mapa interativo.

O projeto integra desenvolvimento web, banco de dados, hardware e inteligência artificial, criando uma solução para tornar o cuidado com as plantas mais simples, organizado e inteligente.

FUNCIONALIDADES DO SISTEMA

LOGIN E AUTENTICAÇÃO DE USUÁRIOS

O sistema possui uma tela de login para que cada usuário possa acessar sua própria conta.

A autenticação permite entrar utilizando e-mail e senha, mantendo os dados associados ao usuário autenticado.

Também existe a opção de criar uma nova conta para utilizar a plataforma.

CADASTRO DE USUÁRIOS

O usuário pode criar uma conta informando seus dados de cadastro.

Após o registro, pode realizar o login e acessar as funcionalidades do PlantaPet.

A autenticação e o gerenciamento das contas são realizados pelo Supabase.

GERENCIAMENTO DE PLANTAS

O sistema permite cadastrar novas plantas, editar informações existentes e excluir plantas cadastradas.

Cada usuário pode organizar suas plantas dentro da própria conta.

As informações das plantas são armazenadas no banco de dados, permitindo consultar os registros posteriormente.

INFORMAÇÕES E IDENTIFICAÇÃO DAS PLANTAS

Cada planta possui suas próprias informações de identificação, como nome e tipo.

Esses dados ajudam a organizar o ambiente e diferenciar as plantas cadastradas.

O sistema utiliza essas informações para relacionar os dados de monitoramento e localização de cada planta.

MONITORAMENTO DA UMIDADE DO SOLO

O PlantaPet possui integração com um sensor de umidade conectado ao ESP32.

O sensor realiza a leitura da umidade do solo e envia os dados para a aplicação.

Dessa maneira, é possível acompanhar as condições do solo e identificar quando uma planta precisa de água.

Quando o sensor não está conectado ou não está funcionando corretamente, o sistema identifica a situação e apresenta o estado de espera ou falha, evitando tratar uma leitura inválida como uma medição real.

INTEGRAÇÃO COM ESP32

O projeto utiliza um ESP32 para realizar a comunicação com os componentes físicos.

O microcontrolador recebe as informações do sensor de umidade e disponibiliza os dados para a aplicação.

Essa integração conecta o ambiente físico ao sistema web, permitindo acompanhar as informações coletadas pelo hardware.

CONTROLE DA IRRIGAÇÃO

O sistema possui integração com um módulo relé responsável pelo acionamento do mecanismo de irrigação.

Por meio dessa integração, é possível controlar o acionamento do sistema de irrigação utilizando o ESP32.

O objetivo é facilitar o processo de fornecimento de água para as plantas.

IDENTIFICAÇÃO DE FALHAS NO SENSOR

O PlantaPet também considera situações em que o sensor de umidade está desconectado ou apresenta problemas de funcionamento.

Quando isso acontece, o sistema informa que está aguardando uma leitura válida.

Essa funcionalidade ajuda a evitar informações incorretas sobre a condição do solo.

ASSISTENTE DE INTELIGÊNCIA ARTIFICIAL

O projeto possui um assistente de inteligência artificial desenvolvido para auxiliar nos cuidados com as plantas.

A integração permite oferecer orientações e informações relacionadas ao cultivo, manutenção e cuidados necessários.

A proposta é facilitar o acesso a informações úteis para quem deseja cuidar melhor de suas plantas.

MAPA INTERATIVO DAS PLANTAS

O PlantaPet possui um mapa interativo que permite visualizar a localização das plantas cadastradas.

Cada planta pode possuir uma localização própria, permitindo organizar diferentes plantas em endereços distintos.

O mapa utiliza as informações reais cadastradas no sistema e apresenta um marcador para cada planta que possui coordenadas geográficas válidas.

Quando uma nova planta é cadastrada com sua localização, ela também passa a aparecer no mapa.

CADASTRO DE LOCALIZAÇÃO POR CEP OU ENDEREÇO

Durante o cadastro ou edição de uma planta, o usuário pode informar sua localização por meio do CEP ou de um endereço.

O sistema utiliza essas informações para identificar a localização geográfica correspondente.

Também é possível informar o número e o complemento do endereço.

PREENCHIMENTO AUTOMÁTICO DE ENDEREÇO

O sistema possui integração com o ViaCEP para facilitar o preenchimento das informações de localização.

Ao informar um CEP válido, a aplicação consulta o serviço e preenche automaticamente os campos disponíveis:

Rua.

Bairro.

Cidade.

Estado.

O usuário precisa complementar as informações necessárias, como número e complemento.

LOCALIZAÇÃO GEOGRÁFICA DAS PLANTAS

Após informar o endereço, o sistema utiliza um serviço de geocodificação para obter as coordenadas geográficas.

Essas coordenadas são utilizadas para posicionar o marcador da planta no mapa.

Dessa forma, cada planta pode ser identificada individualmente de acordo com sua localização cadastrada.

INTEGRAÇÃO COM SUPABASE

O Supabase é utilizado como infraestrutura de banco de dados e autenticação do projeto.

Ele permite armazenar as informações dos usuários e das plantas cadastradas.

Os registros das plantas são relacionados ao usuário responsável, permitindo que cada conta tenha acesso aos próprios dados.

O banco de dados também armazena as informações de endereço e coordenadas utilizadas pelo mapa.

TECNOLOGIAS UTILIZADAS

Frontend:

React.

JavaScript.

Vite.

CSS.

Banco de dados e autenticação:

Supabase.

Mapas e localização:

Leaflet.

React Leaflet.

OpenStreetMap.

Nominatim.

ViaCEP.

Hardware:

ESP32.

Sensor de umidade do solo.

Módulo relé.

Sistema de irrigação.

Inteligência artificial:

Groq.

OBJETIVO DO PROJETO

Meu objetivo com o PlantaPet é desenvolver uma aplicação que una programação, eletrônica e inteligência artificial para melhorar a maneira como cuidamos das plantas.

O projeto busca integrar o monitoramento físico do solo, o controle de irrigação, o armazenamento de informações, a localização geográfica e a inteligência artificial em uma única plataforma.

Com isso, pretendo continuar expandindo o sistema e acrescentando novas funcionalidades para torná-lo cada vez mais completo.
