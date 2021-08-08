import { getImage } from '../getUserImage';

it('should replace the size', () => {
  const url = `www.example.com/user_avatar/wiki.kfox.io/miichael/{size}/15_2.png`;

  expect(getImage(url, 'l')).toEqual(
    `www.example.com/user_avatar/wiki.kfox.io/miichael/150/15_2.png`,
  );
});
