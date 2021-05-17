import { IPC } from "./IPC";

const { naviDomain, naviChannel } = window as any;
const ipc = new IPC(naviDomain, naviChannel);

export default ipc;
