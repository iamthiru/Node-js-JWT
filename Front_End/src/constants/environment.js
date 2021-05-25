export const ENVIRONMENT = {
    STAGING: {
        KEY: "STAGING",
        BASE_URL:  "http://localhost:3004", //"https://test.impact.bentenlab.com/",
        ANALYTICS_DATA_ROOT: "app_analytics_test"
    },
    PRODUCTION: {
        KEY: "PRODUCTION",
        BASE_URL:"http://localhost:3004", // "https://impact.bentenlab.com/",
        ANALYTICS_DATA_ROOT: "app_analytics"
    }
}

export const DEFAULT_ENVIRONMENT_KEY = ENVIRONMENT.STAGING.KEY;
//here i need to give my local db url 