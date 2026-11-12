PlantaPet

O PlantaPet é um projeto que desenvolvi com o objetivo de facilitar o cuidado e o monitoramento de plantas utilizando tecnologia.

A ideia é integrar desenvolvimento web, sensores e inteligência artificial para ajudar no acompanhamento da umidade do solo e fornecer orientações sobre os cuidados com as plantas.

FUNCIONALIDADES

Cadastro e login

- Cadastro de usuários.
- Login com e-mail e senha.
- Autenticação utilizando Supabase.
- Manutenção da sessão mesmo após atualizar a página.
- Cada usuário possui acesso às suas próprias plantas.

Gerenciamento de plantas

- Cadastro de plantas com nome e tipo.
- Visualização das plantas cadastradas.
- Exclusão de plantas.
- Armazenamento dos dados no Supabase.

Monitoramento de umidade

- Integração com sensor de umidade do solo.
- Comunicação com ESP32.
- Exibição do percentual de umidade.
- Identificação de falhas no sensor.
- Indicação quando o sistema está aguardando uma leitura.

Assistente de Inteligência Artificial

- Chat integrado ao painel principal.
- Assistente sempre disponível na tela.
- Respostas sobre cuidados com plantas.
- Orientações sobre irrigação e umidade do solo.
- Respostas considerando as informações da planta selecionada.
- Integração com a API da Groq.

TECNOLOGIAS UTILIZADAS

- React
- Vite
- JavaScript
- CSS
- Supabase
- Supabase Edge Functions
- Groq API
- ESP32
- Sensor de umidade do solo

INTEGRAÇÃO COM ESP32

Utilizei um ESP32 para realizar as leituras de umidade do solo e enviar as informações para a aplicação.

Configuração dos pinos utilizada no projeto:

Sensor de umidade: GPIO 34
Relé: GPIO 26
Sensor magnético (reed switch): GPIO 27

Exemplo de resposta enviada pelo dispositivo:

{
  "umidade": 30,
  "leitura": 3353
}

Uma leitura de 4095 indica que o sensor pode estar desconectado ou não funcionando corretamente.

INTELIGÊNCIA ARTIFICIAL

Para implementar o assistente virtual, utilizei a API da Groq junto com uma Supabase Edge Function chamada assistente-ia.

O assistente recebe as mensagens enviadas pelo usuário e também pode utilizar informações da planta selecionada para fornecer respostas mais contextualizadas.

SEGURANÇA

- Autenticação de usuários pelo Supabase.
- Dados das plantas separados por usuário.
- Utilização de políticas de segurança RLS.
- Proteção de informações sensíveis por meio de variáveis de ambiente e Secrets do Supabase.

PRÓXIMAS MELHORIAS

- Melhorar a automação da irrigação.
- Implementar histórico de umidade.
- Adicionar gráficos de monitoramento.
- Melhorar as respostas e recomendações do assistente virtual.
- Expandir o monitoramento em tempo real.

SOBRE O PROJETO

Esse projeto faz parte do meu aprendizado e desenvolvimento na área de programação. Durante sua construção, trabalhei com React, integração com banco de dados, autenticação, IoT e inteligência artificial.

Ainda pretendo implementar novas funcionalidades e melhorar o sistema.

PlantaPet — Tecnologia para cuidar melhor das plantas.
