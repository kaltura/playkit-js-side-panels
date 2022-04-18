import {registerPlugin} from 'kaltura-player-js';
import {pluginName, SidePanelsManagerService} from './side-panels-service';

registerPlugin(pluginName, SidePanelsManagerService);

export {SidePanelItem, SidePanelPosition, SidePanelMode, ReservedPresetName} from './side-panel-item';
