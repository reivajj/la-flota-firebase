import Danger from 'components/Typography/Danger';

export const to = promise => {
  return promise.then(data => {
    return [null, data];
  })
    .catch(err => [err]);
}

export const toWithOutError = (promise) => {
  return promise.then(result => result);
}

export const errorFormat = (message) => (
  <Danger color="error" variant="h6">{message}</Danger>
);

export const generosMusicales = [
  { value: "alt", nombre: "Alternativo" }, { value: "alt_indie", nombre: "ALTERNATIVO/INDIE ROCK" }, { value: "alt_hard", nombre: "ALTERNATIVO/PUNK" },
  { value: "alt_dance", nombre: "ROCK ALTERNATIVO/DANCE ALTERNATIVO" }, { value: "alt_brit", nombre: "ROCK ALTERNATIVO/BRITISH" }
];

export const getChildData = (obj, key) => obj[key];

// Limited to only JSON supported types.
export const cloneDeepLimited = obj => JSON.parse(JSON.stringify(obj));