import {FunctionalComponent, RefObject} from 'preact';
import {SidePanel} from './components/side-panel.component';
import {ui} from 'kaltura-player-js';
const {ReservedPresetNames} = ui;

export type SidePanelPosition = 'top' | 'bottom' | 'right' | 'left';
export type SidePanelMode = 'alongside' | 'hidden' | 'over';
export type ReservedPresetName = 'Playback' | 'Live';

export class SidePanelItem {
  renderIcon?: FunctionalComponent;
  renderContent: FunctionalComponent;
  presets: ReservedPresetName[];
  position: SidePanelPosition;
  expandMode: SidePanelMode;

  constructor(item: SidePanelItem) {
    this.renderIcon = item.renderIcon;
    this.renderContent = item.renderContent;
    this.presets = item.presets || Object.values(ReservedPresetNames);
    this.position = item.position;
    this.expandMode = item.expandMode;
  }
}

export class PanelItemData {
  public static nextId = 0;
  public id: number;
  public removeComponentFunc: (() => void);
  public item: SidePanelItem;
  public componentRef: RefObject<SidePanel>;
  constructor(item: SidePanelItem, componentRef: RefObject<SidePanel>, removeComponentFunc: () => void) {
    this.id = ++PanelItemData.nextId;
    this.item = item;
    this.removeComponentFunc = removeComponentFunc;
    this.componentRef = componentRef;
  }
}

export class PanelState {
  public activeItem: PanelItemData | null;
  constructor() {
    this.activeItem = null;
  }
}

export class PanelsState {
  public top: PanelState;
  public bottom: PanelState;
  public right: PanelState;
  public left: PanelState;
  constructor() {
    this.top = new PanelState();
    this.bottom = new PanelState();
    this.right = new PanelState();
    this.left = new PanelState();
  }
}
