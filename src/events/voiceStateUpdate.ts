import { CommandHandler, Event } from 'advanced-command-handler'
import { VoiceState } from 'discord.js'
import { MysqlError } from 'mysql'
import { query } from '../functions/db'
import { Config } from '../type/Config'
import { SConfig } from '../type/Database'
import fetch from 'node-fetch'
import asterix from '../JSON/asterix.json'
import fox from "../JSON/fox.json"

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
                            if(c.members.size == 0) c?.delete('Clear of empty voice channel')
                        }
                    }
                } 
                if(newUserChannel != oldUserChannel) { 
                    for(const c of category?.children.array().filter(c=> c.type === 'voice')??[]){
                        if(c != channel) {
                            if(c.members.size == 0) c?.delete('Clear of empty voice channel')
                        }
                    }
                }
                const randomName = await fetch("https://randommer.io/api/Name?nameType=surname&quantity=1", {method: "GET", headers: {'X-Api-Key': "0e254703707f443390ec5d75dc1b1c1b"}}).then(async res => await res.json())
                if(newState.channel === channel){
                    let random = Math.floor(Math.random() * 100) + 1
                    let name = `🔊 ${randomName[0]} #${random}`
                    if (random === 59) {
                        name = `🍻 ${asterix[Math.floor(Math.random() * asterix.length)]} 🍗 #${random}`
                        newState.member?.send(`You finded a secret voice channel : \`${name}\``)
                    } else if (random === 88) {
                        name = `🦊 ${fox[Math.floor(Math.random() * fox.length)]} #${random}`
                        newState.member?.send(`You finded a secret voice channel : \`${name}\``)
                    } else if (random === 22) {
                        let names = handler.client?.guilds.cache.get('820619530744365056')?.roles.cache.get('820629248631898142')?.members.map(m => m.user.username)
                        names?.push(...(handler.client?.guilds.cache.get('820619530744365056')?.roles.cache.get('821128444317794364')?.members.map(m => m.user.username) as string[]))
                        if (!names) names = ['OH NO']
                        name = `${names[Math.floor(Math.random() * names.length)]} #${random}`
                        newState.member?.send(`You finded a secret voice channel : \`${name}\``)
                    }
                    let channel = await newState.guild.channels.create(name,{type:'voice',parent:category?.id});
                    channel.createOverwrite(newState.member?.id??"Nothing", {
                        "MANAGE_CHANNELS": true
                    })
                    newState.member?.voice.setChannel(channel)
                }
            }
        })
    }
)