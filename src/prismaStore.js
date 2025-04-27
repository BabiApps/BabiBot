import { PrismaClient } from '@prisma/client';
import { pino } from "pino";

export class DatabaseStore {
    prisma = new PrismaClient();
    logger = pino();
    sessionId = "BabiBotStore";

    constructor(sessionId) {
        this.sessionId = sessionId;
    }

    /**
     * saves message to the database
     */
    async saveMessage(message) {
        const keyId = message.key?.id;
        const remoteJid = message.key?.remoteJid;
        if (!keyId || !remoteJid) return;

        if (typeof message !== 'object') {
            this.logger.error("Message is not an object", message);
            return;
        }
    
        await this.prisma.message.upsert({
            where: {
                sessionId_remoteJid_id: {
                    sessionId: this.sessionId,  
                    remoteJid: remoteJid,       
                    id: keyId,                 
                }
            },
            create: {
                id: keyId,
                remoteJid: remoteJid,
                sessionId: this.sessionId,
                key: message.key,           
                data: JSON.stringify(message), 
            },
            update: {
                data: JSON.stringify(message), 
            },
        });
    }

    /**
     * loads messages from the database
     */
    async loadMessages(jid, number = 10) {
        const messages = await this.prisma.message.findMany({
            where: {
                sessionId: this.sessionId,
                remoteJid: jid
            },
            orderBy: { createdAt: 'desc' },
            take: number,
        });
        return messages.map(m => JSON.parse(m.data)); 

    }

    /**
     * loads message from the database
     */
    async loadMessage(jid, id) {
        const message = await this.prisma.message.findUnique({
            where: {
                id,
                remoteJid: jid,
                sessionId: this.sessionId
            },
        });
        if (!message) return null;
        return JSON.parse(message.data);
    }

    bind(ev) {
        ev.on('messages.upsert', async ({ messages }) => {
            for (const message of messages) {
                await this.saveMessage(message);
            }
        });
    }
}

export default new DatabaseStore("BabiBotStore");