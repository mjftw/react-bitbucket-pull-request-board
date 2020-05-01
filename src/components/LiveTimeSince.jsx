import {Component} from 'react';
import moment from 'moment';

export default class LiveTimeSince extends Component {
    constructor(props) {
        super(props);
        this.timerInterval = null;
    }

    componentDidMount() {
        this.timerInterval = setInterval(
            () => this.forceUpdate(),
            1000
        );
    }

    componentWillUnmount() {
        clearInterval(this.timerInterval);
    }

    render() {
        return moment(this.props.timestamp).fromNow();
    }
};;
