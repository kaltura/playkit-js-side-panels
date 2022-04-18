import {BasePlugin} from 'kaltura-player-js';
import {SidePanelsManager} from './side-panels-manager';

export const pluginName = 'sidePanelsManager';
export class SidePanelsManagerService extends BasePlugin {
  static defaultConfig = {};

  constructor(name: string, player: any) {
    super(name, player);

    const sidePanelsManager: SidePanelsManager = new SidePanelsManager(player);
    player.registerService(pluginName, sidePanelsManager);
  }

  reset() {
    return;
  }

  destroy() {
    return;
  }

  static isValid(): boolean {
    return true;
  }
}
