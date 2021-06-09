import { CommandHandler, Event } from 'advanced-command-handler'
import { VoiceState } from 'discord.js'
import { MysqlError } from 'mysql'
import { query } from '../functions/db'
import { Config } from '../type/Config'
import { SConfig } from '../type/Database'
import fetch from 'node-fetch'

export default new Event(
    {
        name: 'voiceStateUpdate'
    },

    async (handler: typeof CommandHandler, oldState: VoiceState, newState: VoiceState): Promise<any> => {
        query(`SELECT * FROM config WHERE guild = "${oldState.guild.id}"`, async (err: MysqlError, res: SConfig[]) => {
            const resEdit = res[0]
            const config: Config = JSON.parse(resEdit.config)
            if (config.dynamicVoiceBase) {
                const newUserChannel = newState.channel
                const oldUserChannel = oldState.channel
                const category = oldState.guild.channels.cache.get(config.dynamicVoiceBase)?.parent
                const channel = oldState.guild.channels.cache.get(config.dynamicVoiceBase)
                if(!newUserChannel){
                    for(const c of category?.children.array().filter(c=> c.type === 'voice')??[]){
                        if(c != channel) {
                            if(c.members.size == 0) c.delete('Clear of empty voice channel')
                        }
                    }
                } 
                if(newUserChannel != oldUserChannel) { 
                    for(const c of category?.children.array().filter(c=> c.type === 'voice')??[]){
                        if(c != channel) {
                            if(c.members.size == 0) c.delete('Clear of empty voice channel')
                        }
                    }
                }
                const asterix = require('../JSON/asterix.json')
                const randomName = fetch("https://randommer.io/api/Name?nameType=surname&quantity=20", {method: "GET", headers: {'X-Api-Key': "0e254703707f443390ec5d75dc1b1c1b"}})
                if(newState.channel === channel){
                    let name
                    if (Math.floor(Math.random() * 10) === 8) {
                        name = `⚔️ ${asterix[Math.floor(Math.random() * asterix.length)]}`
                    } else {
                        name = `🔊 ${randomName}`
                    }
                    let channel = await newState.guild.channels.create(`🔊 ${asterix[Math.floor(Math.random() * asterix.length)]}`,{type:'voice',parent:category?.id});
                    channel.createOverwrite(newState.member?.id??"Nothing", {
                        "MANAGE_CHANNELS": true
                    })
                    newState.member?.voice.setChannel(channel)
                }
            }
        })
    }
)