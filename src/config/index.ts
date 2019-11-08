import './env';

interface INFO {
  BUCKET: string;
  ACCESSKEYID: string;
  SECRETACCESSKEY: string;
  SLACK_WEB_HOOK_URL: string;
}

interface Config {
  development: INFO;
  production: INFO;
}

const config: Config = {
  development: {
    BUCKET: process.env.S3_BUCKET_TEST,
    ACCESSKEYID: process.env.S3_ACCESSKEYID,
    SECRETACCESSKEY: process.env.S3_SECRETACCESSKEY,
    SLACK_WEB_HOOK_URL: process.env.SLACK_WEB_HOOK_URL,
  },
  production: {
    BUCKET: process.env.S3_BUCKET_REAL,
    ACCESSKEYID: process.env.S3_ACCESSKEYID,
    SECRETACCESSKEY: process.env.S3_SECRETACCESSKEY,
    SLACK_WEB_HOOK_URL: process.env.SLACK_WEB_HOOK_URL,
  },
};

const getSettings = <T extends keyof Config>(env: T) => config[env];

const defaultConfig = {
  PORT: process.env.PORT || 9999,
  ENV: process.env.NODE_ENV,
};

export default {
  ...defaultConfig,
  ...getSettings(process.env.NODE_ENV as keyof Config),
};
