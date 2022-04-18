import {h, Component, Fragment} from 'preact';

type ExpandableState = {
  isActive: boolean;
};

export class SidePanel extends Component<any, ExpandableState> {
  constructor() {
    super();
    this.state = {isActive: false};
  }

  display(isActive: boolean) {
    this.setState({isActive});
  }

  render() {
    return this.state.isActive ? this.props.children : null;
  }
}

// import {ui} from 'kaltura-player-js';
// display(isActive: boolean) {
//   if (isActive) {
//     this.setState({isActive});
//   } else {
//     setTimeout(() => this.setState({isActive}), Number(ui.style.defaultTransitionTime));
//
//   }
// }
