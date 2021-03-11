import { IPC, INaviSendParams, ExtensionDomain } from './IPC';
import { NaviError } from './Error';

declare global {
  interface Window {
    naviDomain: ExtensionDomain;
    naviSend: (params: INaviSendParams) => Promise<any>;

    naviChannels: { [key: string]: IPC };
  }
}

window.naviChannels = {};
window.naviSend = async ({
  domain, topic, data, channel,
}: INaviSendParams) => {
  if (!window.naviDomain) throw NaviError.missingDomain();

  if (!window.naviChannels[channel]) {
    window.naviChannels[channel] = new IPC(channel, window.naviDomain);
  }

  const chan = window.naviChannels[channel];

  if (!chan.isSetup) chan.setup();

  chan.send(topic, data);
}