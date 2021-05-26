export const ENVIRONMENT = {
    STAGING: {
        KEY: "STAGING",
        BASE_URL:"https://test.impact.bentenlab.com/",
        ANALYTICS_DATA_ROOT: "app_analytics_test"
    },
    PRODUCTION: {
        KEY: "PRODUCTION",
        BASE_URL:"https://impact.bentenlab.com/",
        ANALYTICS_DATA_ROOT: "app_analytics"
    }
}

export const DEFAULT_ENVIRONMENT_KEY = ENVIRONMENT.STAGING.KEY;