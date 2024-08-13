let token = '1234567890';

export let setToken = (userToken: string) => {
  return (token = userToken);
};

export let getToken = async () => {
  return token;
};

export let removeToken = async () => {
  return (token = '');
};
