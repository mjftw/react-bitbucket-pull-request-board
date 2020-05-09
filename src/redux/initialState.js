const initialState = {
    "pullRequests": {
        "loading": false,
        "all": []
    },
    "repos": {
        "loading": false,
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
            "accessToken": null //FIXME: Must manually supply access token as app has no way to get itself one
        }
    },
    "refresh": {
        "shouldDataRefresh": true,
        "mins": 10
    }
};
export default initialState;