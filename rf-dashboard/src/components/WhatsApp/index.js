'use strict';
const fs = require('fs');
const { Client, Location } = require('whatsapp-web.js');

const SESSION_FILE_PATH = './session.json';
let sessionCfg;
if (fs.existsSync(SESSION_FILE_PATH)) {
  sessionCfg = require(SESSION_FILE_PATH);
}

const client = new Client({ puppeteer: { headless: false }, session: sessionCfg });
// Você pode usar uma sessão existente e evitar escanear um código QR adicionando um objeto "sessão" às opções do cliente.
// Este objeto deve incluir WABrowserId, WASTretBundle, WAToken1 e WAToken2.

client.initialize();

client.on('qr', (qr) => {
  // NOTA: Este evento não será disparado se uma sessão for especificada.
  console.log('QR RECEIVED', qr);
});

client.on('authenticated', (session) => {
  console.log('AUTHENTICATED', session);
  sessionCfg = session;
  fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), function (err) {
    if (err) {
      console.error(err);
    }
  });
});

client.on('auth_failure', msg => {
  // Disparado se a restauração da sessão não foi bem-sucedida
  console.error('AUTHENTICATION FAILURE', msg);
});

client.on('ready', () => {
  console.log('READY');
});

client.on('message', async msg => {
  console.log('MESSAGE RECEIVED', msg);

  if (msg.body == '!ping reply') {
    // Send a new message as a reply to the current one
    msg.reply('pong');

  } else if (msg.body == '!ping') {
    // Send a new message to the same chat
    client.sendMessage(msg.from, 'pong');

  } else if (msg.body.startsWith('!sendto ')) {
    // Direct send a new message to specific id
    let number = msg.body.split(' ')[1];
    let messageIndex = msg.body.indexOf(number) + number.length;
    let message = msg.body.slice(messageIndex, msg.body.length);
    number = number.includes('@c.us') ? number : `${number}@c.us`;
    let chat = await msg.getChat();
    chat.sendSeen();
    client.sendMessage(number, message);

  } else if (msg.body.startsWith('!subject ')) {
    // Change the group subject
    let chat = await msg.getChat();
    if (chat.isGroup) {
      let newSubject = msg.body.slice(9);
      chat.setSubject(newSubject);
    } else {
      msg.reply('Este comando só pode ser usado em um grupo!');
    }
  } else if (msg.body.startsWith('!echo ')) {
    // Replies with the same message
    msg.reply(msg.body.slice(6));
  } else if (msg.body.startsWith('!desc ')) {
    // Change the group description
    let chat = await msg.getChat();
    if (chat.isGroup) {
      let newDescription = msg.body.slice(6);
      chat.setDescription(newDescription);
    } else {
      msg.reply('Este comando só pode ser usado em um grupo!');
    }
  } else if (msg.body == '!leave') {
    // Leave the group
    let chat = await msg.getChat();
    if (chat.isGroup) {
      chat.leave();
    } else {
      msg.reply('Este comando só pode ser usado em um grupo!');
    }
  } else if (msg.body.startsWith('!join ')) {
    const inviteCode = msg.body.split(' ')[1];
    try {
      await client.acceptInvite(inviteCode);
      msg.reply('Entrou no grupo!');
    } catch (e) {
      msg.reply('Esse código de convite parece ser inválido.');
    }
  } else if (msg.body == '!groupinfo') {
    let chat = await msg.getChat();
    if (chat.isGroup) {
      msg.reply(`
                *Detalhes do Grupo*
                Nome: ${chat.name}
                Descrição: ${chat.description}
                Criado em: ${chat.createdAt.toString()}
                Criado por: ${chat.owner.user}
                Contagem de participantes: ${chat.participants.length}
            `);
    } else {
      msg.reply('Este comando só pode ser usado em um grupo!');
    }
  } else if (msg.body == '!chats') {
    const chats = await client.getChats();
    client.sendMessage(msg.from, `O bot tem ${chats.length} chats abertos.`);
  } else if (msg.body == '!info') {
    let info = client.info;
    client.sendMessage(msg.from, `
            *Informação de conexão*
            Nome do usuário: ${info.pushname}
            Meu numero: ${info.me.user}
            Plataforma: ${info.platform}
            Versão WhatsApp: ${info.phone.wa_version}
        `);
  } else if (msg.body == '!mediainfo' && msg.hasMedia) {
    const attachmentData = await msg.downloadMedia();
    msg.reply(`
            *Informação de mídia*
            MimeType: ${attachmentData.mimetype}
            Filename: ${attachmentData.filename}
            Data (comprimento): ${attachmentData.data.length}
        `);
  } else if (msg.body == '!quoteinfo' && msg.hasQuotedMsg) {
    const quotedMsg = await msg.getQuotedMessage();

    quotedMsg.reply(`
            ID: ${quotedMsg.id._serialized}
            Tipo: ${quotedMsg.type}
            Autor: ${quotedMsg.author || quotedMsg.from}
            Timestamp: ${quotedMsg.timestamp}
            Tem mídia? ${quotedMsg.hasMedia}
        `);
  } else if (msg.body == '!resendmedia' && msg.hasQuotedMsg) {
    const quotedMsg = await msg.getQuotedMessage();
    if (quotedMsg.hasMedia) {
      const attachmentData = await quotedMsg.downloadMedia();
      client.sendMessage(msg.from, attachmentData, { caption: 'Aqui está a mídia solicitada.' });
    }
  } else if (msg.body == '!location') {
    msg.reply(new Location(37.422, -122.084, 'Googleplex\nGoogle Headquarters'));
  } else if (msg.location) {
    msg.reply(msg.location);
  } else if (msg.body.startsWith('!status ')) {
    const newStatus = msg.body.split(' ')[1];
    await client.setStatus(newStatus);
    msg.reply(`O status foi atualizado para *${newStatus}*`);
  } else if (msg.body == '!mention') {
    const contact = await msg.getContact();
    const chat = await msg.getChat();
    chat.sendMessage(`Oi @${contact.number}!`, {
      mentions: [contact]
    });
  } else if (msg.body == '!delete' && msg.hasQuotedMsg) {
    const quotedMsg = await msg.getQuotedMessage();
    if (quotedMsg.fromMe) {
      quotedMsg.delete(true);
    } else {
      msg.reply('Eu só posso deletar minhas próprias mensagens');
    }
  } else if (msg.body === '!pin') {
    const chat = await msg.getChat();
    await chat.pin();
  } else if (msg.body === '!archive') {
    const chat = await msg.getChat();
    await chat.archive();
  } else if (msg.body === '!mute') {
    const chat = await msg.getChat();
    // silencie o chat por 20 segundos
    const unmuteDate = new Date();
    unmuteDate.setSeconds(unmuteDate.getSeconds() + 20);
    await chat.mute(unmuteDate);
  } else if (msg.body === '!typing') {
    const chat = await msg.getChat();
    // simula a digitação no chat
    chat.sendStateTyping();
  } else if (msg.body === '!recording') {
    const chat = await msg.getChat();
    // simula a gravação de áudio no chat
    chat.sendStateRecording();
  } else if (msg.body === '!clearstate') {
    const chat = await msg.getChat();
    // para de digitar ou gravar no chat
    chat.clearState();
  }
});

client.on('message_create', (msg) => {
  // Disparado em todas as criações de mensagens, incluindo a sua
  if (msg.fromMe) {
    // faça coisas aqui
  }
});

client.on('message_revoke_everyone', async (after, before) => {
  // Disparado sempre que uma mensagem é excluída por alguém (incluindo você)
  console.log(after); // mensagem depois de ser excluída.
  if (before) {
    console.log(before); // mensagem antes de ser excluída.
  }
});

client.on('message_revoke_me', async (msg) => {
  // Disparado sempre que uma mensagem é excluída apenas em sua própria visualização.
  console.log(msg.body); // mensagem antes de ser excluída.
});

client.on('message_ack', (msg, ack) => {
  /*
      == ACK VALUES ==
      ACK_ERROR: -1
      ACK_PENDING: 0
      ACK_SERVER: 1
      ACK_DEVICE: 2
      ACK_READ: 3
      ACK_PLAYED: 4
  */

  if (ack == 3) {
    // A mensagem foi lida
  }
});

client.on('group_join', (notification) => {
  // O usuário entrou ou foi adicionado ao grupo.
  console.log('Junte-se', notification);
  notification.reply('User joined.');
});

client.on('group_leave', (notification) => {
  // O usuário saiu ou foi expulso do grupo.
  console.log('sair', notification);
  notification.reply('User left.');
});

client.on('group_update', (notification) => {
  // A foto, o assunto ou a descrição do grupo foram atualizados.
  console.log('update', notification);
});

client.on('change_battery', (batteryInfo) => {
  // A porcentagem da bateria para o dispositivo conectado mudou
  const { battery, plugged } = batteryInfo;
  console.log(`Bateria: ${battery}% - Carregando? ${plugged}`);
});

client.on('disconnected', (reason) => {
  console.log('O cliente foi desconectado', reason);
});

