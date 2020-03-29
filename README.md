# Integração Pipedrive e Bling - LinkApi

## Sicronizar as plataformas e popular banco MongoDB

Para rodar o script de sincronização utilize o comando `yarn syncDeals`

É possível fazer com que o script sincronize as plataformas automaticamente através de uma tarefa cron em um abiente linux, exemplo:

Sincronizar a cada 5 minutos: `5 * * * * yarn (caminho do projeto)/syncDeals >/dev/null 2>&1`

Mais informações: https://crontab-generator.org/

## Listagem de oportunidades

Para listar as oportunidades agregadas por dia e valor no banco de dados MongoDB, utilize o comando `yarn start` para iniciar o servidor, então acesse a rota http://localhost:3333/deals para visualizar as oportunidades gravadas.
