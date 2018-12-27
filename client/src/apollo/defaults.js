import { getToken } from '../lib/utils/authUtils';

const globalDefaults = {
  loggedIn: !!getToken(),
};

export default globalDefaults;
