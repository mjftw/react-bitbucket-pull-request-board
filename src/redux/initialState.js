const initialState = {
    "pullRequests": {
        "loading": false,
        "all": []
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