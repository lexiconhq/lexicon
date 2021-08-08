import { newPostIsValid } from '../newPostIsValid';

it('should be false if there is no title', () => {
  const title = '';
  const content = 'My first post';
  const uploadsInProgress = 0;
  expect(newPostIsValid(title, content, uploadsInProgress)).toEqual(false);
});

it('should be false if there is no content', () => {
  const title = 'Hello, World!';
  const content = '';
  const uploadsInProgress = 0;
  expect(newPostIsValid(title, content, uploadsInProgress)).toEqual(false);
});

it('should be false when uploading an image', () => {
  const title = 'First Post';
  const content = `Here's a picture of my dog
                      [uploading...](1)
                      that's his favorite toy`;
  const uploadsInProgress = 1;
  expect(newPostIsValid(title, content, uploadsInProgress)).toEqual(false);
});

it('should be true when finished uploading images', () => {
  const title = 'Second Post';
  const content = `Here's a picture of my dog
                      ![image](1)
                      that's his favorite toy`;
  const uploadsInProgress = 0;
  expect(newPostIsValid(title, content, uploadsInProgress)).toEqual(true);
});

it('should be true when the user intentionally type [uploading...](x)', () => {
  const title = 'Third Post';
  const content = '[uploading...](1)';
  const uploadsInProgress = 0;
  expect(newPostIsValid(title, content, uploadsInProgress)).toEqual(true);
});

it('should be true when the draft has a non-empty content and no attachments', () => {
  const title = 'First Reply';
  const content = 'My first reply';
  const uploadsInProgress = 0;
  expect(newPostIsValid(title, content, uploadsInProgress)).toEqual(true);
});
