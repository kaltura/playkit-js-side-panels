import {h, Component, createRef, RefObject, FunctionalComponent} from 'preact';
import {ui} from 'kaltura-player-js';
import {PanelItemData, PanelsState, SidePanelItem, SidePanelPosition} from './side-panel-item';
import {SidePanel} from './components/side-panel.component';

const {SidePanelModes, SidePanelPositions, ReservedPresetNames, ReservedPresetAreas} = ui;

const OPPOSITE_PANELS: Record<SidePanelPosition, SidePanelPosition> = {
  [SidePanelPositions.TOP]: SidePanelPositions.BOTTOM,
  [SidePanelPositions.BOTTOM]: SidePanelPositions.TOP,
  [SidePanelPositions.RIGHT]: SidePanelPositions.LEFT,
  [SidePanelPositions.LEFT]: SidePanelPositions.RIGHT,
} as Record<SidePanelPosition, SidePanelPosition>;

export class SidePanelsManager {
  private player: any;
  private panels: PanelsState;
  private componentsRegistry: Map<number, PanelItemData>;

  constructor(player: any) {
    this.player = player;
    this.panels = new PanelsState();
    this.componentsRegistry = new Map<number, PanelItemData>();
  }

  public addPanel(item: SidePanelItem): number {
    const newPanelItem: SidePanelItem = new SidePanelItem(item);
    const {position, renderContent} = item;
    const {componentRef, removeComponentFunc} = this.addComponent(renderContent, position);
    const newPanelItemData: PanelItemData = new PanelItemData(newPanelItem, componentRef, removeComponentFunc);
    if (item.renderIcon)
      this.addIcon(item.renderIcon, () => {
        this.toggle(newPanelItemData.id);
      });
    this.componentsRegistry.set(newPanelItemData.id, newPanelItemData);
    return newPanelItemData.id;
  }

  public activateItem(itemId: number): void {
    const item: PanelItemData | undefined = this.componentsRegistry.get(itemId);
    if (item) {
      const {position, expandMode} = item.item;
      // Trying to activate an already active item
      if (this.isItemActive(itemId)) return;
      // Switch between items if currently there is an active one (without collapsing / expanding PS)
      if (this.panels[position].activeItem) {
        this.deactivateItem(this.panels[position].activeItem!.id);
      }
      // Deactivate the opposite panel if is active
      const oppositePosition: SidePanelPosition = this.getOppositePanelPosition(position);
      if (this.panels[oppositePosition].activeItem) {
        this.deactivateItem(this.panels[oppositePosition].activeItem!.id);
      }
      // Update new item as active
      item.componentRef.current?.display(true);
      this.expand(position, expandMode);
      this.panels[position].activeItem = item;
    }
  }

  public deactivateItem(itemId: number): void {
    const item: PanelItemData | undefined = this.componentsRegistry.get(itemId);
    if (item) {
      const {position} = item.item;
      this.panels[position].activeItem?.componentRef.current?.display(false);
      this.collapse(position);
      this.panels[position].activeItem = null;
    }
  }

  public isItemActive(itemId: number): boolean {
    const item: PanelItemData | undefined = this.componentsRegistry.get(itemId);
    return item ? this.panels[item.item.position].activeItem?.id === itemId : false;
  }

  private toggle(itemId: number) {
    if (this.isItemActive(itemId)) {
      this.deactivateItem(itemId);
    } else {
      this.activateItem(itemId);
    }
  }

  private expand(position: SidePanelPosition, expandMode: string) {
    this.player.ui._uiManager.store.dispatch(ui.reducers.shell.actions.updateSidePanelMode(position, expandMode));
  }

  private collapse(position: string) {
    this.player.ui._uiManager.store.dispatch(
      ui.reducers.shell.actions.updateSidePanelMode(position, SidePanelModes.HIDDEN)
    );
  }

  private addIcon(IconComponent: FunctionalComponent, toggelFunc: () => void) {
    this.player.ui.addComponent({
      // label: ???`,
      presets: [ReservedPresetNames.Playback, ReservedPresetNames.Live],
      area: ReservedPresetAreas.TopBarRightControls,
      get: function MyComponent() {
        return (
          <div onClick={toggelFunc}>
            <IconComponent />
          </div>
        );
      },
    });
  }

  private addComponent(
    PanelComponent: FunctionalComponent,
    position: SidePanelPosition
  ): {componentRef: RefObject<SidePanel>; removeComponentFunc: () => void} {
    const componenetRef: RefObject<SidePanel> = createRef();
    // relevantPanel.activeItem.removeComponentFunc = this.player.ui.addComponent({
    const removeComponentFunc = this.player.ui.addComponent({
      label: 'SidePanelLeftDynamicComponent',
      presets: [ReservedPresetNames.Playback, ReservedPresetNames.Live],
      area: this.getPanelArea(position),
      get: () => {
        return (
          <SidePanel ref={componenetRef}>
            <PanelComponent />
          </SidePanel>
        );
      },
    });

    return {componentRef: componenetRef, removeComponentFunc};
  }

  private getPanelArea(positon: string) {
    return `SidePanel${positon.charAt(0).toUpperCase()}${positon.slice(1)}`;
  }

  private getOppositePanelPosition(position: SidePanelPosition): SidePanelPosition {
    return OPPOSITE_PANELS[position];
  }
}
