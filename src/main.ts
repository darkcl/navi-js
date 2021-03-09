import { IPC } from './IPC';

const { naviDomain, naviChannel } = (window as any);
(window as any).ipc = new IPC(naviDomain, naviChannel);