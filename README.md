# Mentoring Alert

 O objetivo deste projeto é possibilitar que tanto os mentores quanto os participantes possam enviar um alerta via whatsapp caso uma das partes não tenham comparecido para a call.

 Para manter os números de contato privados foi utilizada a API de Whatsapp ZENVIA para fazer o envio dos alertas.

[![feito-no-VSCode](https://img.shields.io/badge/VSCode-1f425f.svg)](https://code.visualstudio.com/) [![made-with-typescript](https://img.shields.io/badge/Typescript-1f425f.svg)](https://www.typescriptlang.org/) [![API-Zenvia](https://img.shields.io/badge/API-Zenvia-1f425f.svg)](https://app.zenvia.com/) [![Next.js](https://img.shields.io/badge/Next.js-1f425f.svg)](https://nextjs.org/) [![Jest](https://img.shields.io/badge/Jest-1f425f.svg)](https://jestjs.io/)
 ## Como Funciona

Envie o comando `mentoria` mais o id `#1` - `mentoria#1`
Após o envio o sistema vai verificar se você pertence a essa mentoria e enviar os alertas.

| Comando | Participante | Mentor |
| :-----: | :----------: | :----: |
|![Alt Text](https://github.com/jorge-lba/whatsapp-bot/blob/main/assets/send_msg.gif?raw=true)|![Alt Text](https://github.com/jorge-lba/whatsapp-bot/blob/main/assets/msg_participant.gif?raw=true)|![Alt Text](https://github.com/jorge-lba/whatsapp-bot/blob/main/assets/msg_mentor.gif?raw=true)|
| Comando enviado por uma das partes. | Alerta recebido pelo participante. | Alerta recebido pelo mentor. |

## API Zenvia

Para utilizar a API utilizei os dados da [documentação](https://zenvia.github.io/zenvia-openapi-spec/v2/#section/WhatsApp-sender-and-recipient), [sandbox](https://app.zenvia.com/home/sandbox) e tutorial em [video](https://youtu.be/e6KgvZQ7XDY?t=1044).

O envio de mensagem é efetuado através de uma requisição `http` do tipo `POST`. Exemplo:
```ts
const sendingMessage =(request: AxiosInstance) => 
  async (contact:BodySengingText) => 
    (await request({data: JSON.stringify(contact)})).data
```
Está função tem como entrada no **primeiro parâmetro** uma configuração  `axios`:
```ts
const setAxiosConfig = (baseURL:string) => 
  (contentType:string) => 
  (token:string) => 
  (method:Method) => axios.create({
    baseURL, 
    headers: {
      'content-type': contentType,
      'X-API-TOKEN': token
    },
    method: method
  })
```
O **segundo parâmetro** é composto de um objeto com as informações necessárias para o envio da mensagem:
```ts
const contact = {
  from: string,
  to: string,
  contents: [
    {
      type: string,
      text: string
    }
  ]
}
```
O retorno da função contem o `body` de resposta da requisição.
