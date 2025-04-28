import { writeFileSync, readFileSync, existsSync } from 'fs'
import pkg from '@adiwajshing/baileys'
const { proto, jidNormalizedUser } = pkg
import makeOrderedDictionary from './make-ordered-dictionary.js'


export const waMessageID = (m) => m.key.id || '';
const makeMessagesDictionary = () => makeOrderedDictionary(waMessageID);

export default () => {
	const messages = {}
	
    const assertMessageList = (jid) => {
		if(!messages[jid]) {
			messages[jid] = makeMessagesDictionary()
		}
		return messages[jid]
	}

	const bind = (ev) => {
		ev.on('messages.upsert', ({ messages: newMessages, type }) => {
			switch (type) {
			case 'append':
			case 'notify':
				for(const msg of newMessages) {
					const jid = jidNormalizedUser(msg.key.remoteJid)
					const list = assertMessageList(jid)
					list.upsert(msg, 'append')
				}

				break
			}
		})
		ev.on('messages.update', updates => {
			for(const { update, key } of updates) {
				const list = assertMessageList(jidNormalizedUser(key.remoteJid))
				if(update?.status) {
					const listStatus = list.get(key.id)?.status
					if(listStatus && update?.status <= listStatus) {
						delete update.status
					}
				}
				list.updateAssign(key.id, update)
			}
		})
		ev.on('messages.delete', item => {
			if('all' in item) {
				const list = messages[item.jid]
				list?.clear()
			} else {
				const jid = item.keys[0].remoteJid
				const list = messages[jid]
				if(list) {
					const idSet = new Set(item.keys.map(k => k.id))
					list.filter(m => !idSet.has(m.key.id))
				}
			}
		})
	}

	const toJSON = () => ({
		messages
	})

	const fromJSON = (json) => {
		for(const jid in json.messages) {
			const list = assertMessageList(jid)
			for(const msg of json.messages[jid]) {
				list.upsert(proto.WebMessageInfo.fromObject(msg), 'append')
			}
		}
	}


	return {
		bind,
		/** loads messages from the store, if not found -- uses the legacy connection */
		loadMessages: async(jid, count, cursor) => {
			const list = assertMessageList(jid)
			const mode = !cursor || 'before' in cursor ? 'before' : 'after'
			const cursorKey = !!cursor ? ('before' in cursor ? cursor.before : cursor.after) : undefined
			const cursorValue = cursorKey ? list.get(cursorKey.id) : undefined

			let messages
			if(list && mode === 'before' && (!cursorKey || cursorValue)) {
				if(cursorValue) {
					const msgIdx = list.array.findIndex(m => m.key.id === cursorKey?.id)
					messages = list.array.slice(0, msgIdx)
				} else {
					messages = list.array
				}

				const diff = count - messages.length
				if(diff < 0) {
					messages = messages.slice(-count) // get the last X messages
				}
			} else {
				messages = []
			}

			return messages
		},
		
		loadMessage: async(jid, id) => messages[jid]?.get(id),
		
		toJSON,
		fromJSON,
		writeToFile: (path) => {
			writeFileSync(path, JSON.stringify(toJSON()))
		},
		readFromFile: (path) => {
			if(existsSync(path)) {
				const jsonStr = readFileSync(path, { encoding: 'utf-8' })
				const json = JSON.parse(jsonStr)
				fromJSON(json)
			}
		}
	}
}