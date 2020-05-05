const initialState = {
    "pull_requests": {
        "loading": false,
        "byId": []
    },
    "repos": {
        "loading": false,
        "found": [],
        "selected": []
    },
    "workspaces": {
        "selected": null,
        "found": []
    },
    "external": {
        "bitbucket": {
            "accessToken": null
        }
    },
    "refresh": {
        "shouldDataRefresh": true,
        "mins": 10
    }
};
export default initialState;