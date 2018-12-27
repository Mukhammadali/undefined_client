import jsCookie from 'js-cookie';
import config from '../../config';

export const getToken = () => jsCookie.get('hackaton_token');

export const setToken = token =>
  jsCookie.set('hackaton_token', token, {
    expires: config.cookieExpDays,
  });

export const resetToken = () => jsCookie.remove('hackaton_token');
