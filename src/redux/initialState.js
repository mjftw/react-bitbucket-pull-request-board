const initialState = {
    "pullRequests": {
        "loading": false,
        "all": []
    },
    "repos": {
        "loading": false,
        "fetchError": null,
        "all": [],
        "selected": []
    },
    "workspaces": {
        "loading": false,
        "fetchError": null,
        "selected": null,
        "all": []
    },
    "external": {
        "bitbucket": {
            "accessToken": null,
            "gotNoAuthFetchError": false
        }
    },
    "refresh": {
        "shouldDataRefresh": true,
        "mins": 10
    }
};
export default initialState;