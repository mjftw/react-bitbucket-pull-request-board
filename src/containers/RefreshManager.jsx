import {Component} from 'react';
import {connect} from 'react-redux';
import {refreshData} from '../redux/refresh/actions';

class RefreshManager extends Component {
    constructor(props) {
        super(props);

        this.setRefreshIntervalTimer = this.setRefreshIntervalTimer.bind(this);
        this.disableRefreshData = this.disableRefreshData.bind(this);

        this.updateTimer = null;
        this.updateTimerInterval = null;
    }

    componentWillUnmount() {
        this.disableRefreshData();
    }

    disableRefreshData() {
        if (this.updateTimerInterval) {
            console.log('Disabling data refresh');

            clearInterval(this.updateTimer);
            this.updateTimerInterval = null;
        }
    }

    setRefreshIntervalTimer(mins) {
        if (this.updateTimerInterval === mins) {
            return;
        }

        this.disableRefreshData();

        console.log(`Setting data refresh rate to ${mins} mins`);
        this.updateTimerInterval = mins;
        this.updateTimer = setInterval(() => (
            this.props.refreshData()),
            this.updateTimerInterval * 1000 * 60);
    }

    render() {
        if (this.props.shouldDataRefresh) {
            this.setRefreshIntervalTimer(this.props.refreshMins);
        }
        else {
            this.disableRefreshData();
        }

        return null;
    }
};

export default connect(
    (state) => ({
        refreshMins: state.refresh.mins,
        shouldDataRefresh: state.refresh.shouldDataRefresh
    }),
    {
        refreshData
    }
)(RefreshManager);