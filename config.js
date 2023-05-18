import Config from 'react-native-config';

const config = {
  OPENAI_API_KEY: Config.OPENAI_API_KEY,
  GRAPHCMS_API_KEY: Config.GRAPHCMS_API_KEY,
};

export default {
  ...config,
};
