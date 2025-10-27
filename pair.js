const PastebinAPI = require('pastebin-js');
const pastebin = new PastebinAPI('EMWTMkQAVfJa9kM-MRUrxd5Oku1U7pgL');
const { makeid } = require('./id');
const express = require('express');
const fs = require('fs');
const pino = require('pino');
const {
    default: makeWASocket,
    useMultiFileAuthState,
    fetchLatestBaileysVersion,
    delay,
    makeCacheableSignalKeyStore,
} = require("@whiskeysockets/baileys");

const router = express.Router();

// Helper function to remove files
function removeFile(filePath) {
    if (!fs.existsSync(filePath)) return false;
    fs.rmSync(filePath, { recursive: true, force: true });
}

// Route handler
router.get('/', async (req, res) => {
    const id = makeid();
    let num = req.query.number;

    async function RAVEN() {
        const { version } = await fetchLatestBaileysVersion();
        const { state, saveCreds } = await useMultiFileAuthState('./temp/' + id);
        try {
      const client = makeWASocket({
        printQRInTerminal: false,
        version,
        logger: pino({
          level: 'silent',
        }),
        browser: ['Ubuntu', 'Chrome', '20.0.04'],
        auth: state,
      })

            if (!client.authState.creds.registered) {
                await delay(1500);
                num = num.replace(/[^0-9]/g, '');
                const code = await client.requestPairingCode(num);

                 if (!res.headersSent) {
                    await res.send({ code });
                }
            }

            client.ev.on('creds.update', saveCreds);
            client.ev.on('connection.update', async (s) => {
                const { connection, lastDisconnect } = s;
                if (connection === 'open') {
                await client.sendMessage(client.user.id, { text: `Generating your session_id, Wait . .` });
                    await delay(6000);

                    const data = fs.readFileSync(__dirname + `/temp/${id}/creds.json`);
                    await delay(5000);
                    const b64data = Buffer.from(data).toString('base64');
                    const session = await client.sendMessage(client.user.id, { text: 'YOANN~XMD~' + b64data });

                    // Send message after session
                    await client.sendMessage(client.user.id, {text: `

   ⚡ *YOANN XMD* 𝗦𝗘𝗦𝗦𝗜𝗢𝗡
 𝗖𝗢𝗡𝗡𝗘𝗖𝗧𝗘𝗗 𝗦𝗨𝗖𝗖𝗘𝗦𝗦𝗙𝗨𝗟𝗟𝗬⚡

╔═══『 𝗩𝗜𝗦𝗜𝗧 𝗙𝗢𝗥 𝗛𝗘𝗟𝗣 』═══❒
║❒ 👨‍💻𝗢𝗪𝗡𝗘𝗥 : https://wa.me/2250143875869
║❒📁 𝗥𝗘𝗣𝗢 : https://github.com/Yoann-official1/YOANN-XMD
║❒ 📡 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟 : https://whatsapp.com/channel/0029VbB06qE9sBIFlu00Dq0R 
║❒👥 𝗚𝗥𝗢𝗨𝗣 𝗦𝗨𝗣𝗣𝗢𝗥𝗧 : 
https://chat.whatsapp.com/KUhcRsvJIYE6outjzlj4FA?mode=ems_copy_t
╚══════════════════════❒  ` }, { quoted: session });

                    await delay(100);
                    await client.ws.close();
                    removeFile('./temp/' + id);
                } else if (connection === 'close' && lastDisconnect && lastDisconnect.error && lastDisconnect.error.output.statusCode !== 401) {
                    await delay(10000);
                    RAVEN();
                }
            });
        } catch (err) {
            console.log('service restarted', err);
            removeFile('./temp/' + id);
            if (!res.headersSent) {
                await res.send({ code: 'Service Currently Unavailable' });
            }
        }
    }

    await RAVEN();
});

module.exports = router;
