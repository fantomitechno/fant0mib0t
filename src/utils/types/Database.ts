export interface Config {
  id: string;
  antilink: boolean;
  anitupper: boolean;
  antispam: boolean;
  antiduplicated: boolean;
  linkpreview: boolean;
  dynamicVoiceBase?: string;
}

export const defaultConfig: Config = {
  id: '',
  antilink: false,
  anitupper: false,
  antispam: false,
  antiduplicated: false,
  linkpreview: false,
};

export interface Case {
  id: number;
  reason: string;
  punishment: string;
  moderatorID: string;
}
