import { existingPostIsValid } from '../existingPostIsValid';

const title = 'My Pet Dog';
const oldTitle = 'My Pet';
const content = `Here's a picture of my dog
                    ![image](1)
                    that's his favorite toy`;
const oldContent = 'My first post';
const channel = 2;
const oldChannel = 1;
const tags = ['pet', 'dog'];
const oldTags = ['pet'];
const uploadsInProgress = 0;

it('should be false if there is no title', () => {
  const title = '';
  const postIsValid = existingPostIsValid(
    uploadsInProgress,
    title,
    oldTitle,
    content,
    oldContent,
    channel,
    oldChannel,
    tags,
    oldTags,
  );
  expect(postIsValid).toMatchObject({ isValid: false });
});

it('should be false if there is no content', () => {
  const content = '';
  const postIsValid = existingPostIsValid(
    uploadsInProgress,
    title,
    oldTitle,
    content,
    oldContent,
    channel,
    oldChannel,
    tags,
    oldTags,
  );
  expect(postIsValid).toMatchObject({ isValid: false });
});

it('should be false when uploading an image', () => {
  const content = `Here's a picture of my dog
                      [uploading...](1)
                      that's his favorite toy`;
  const uploadsInProgress = 1;
  const postIsValid = existingPostIsValid(
    uploadsInProgress,
    title,
    oldTitle,
    content,
    oldContent,
    channel,
    oldChannel,
    tags,
    oldTags,
  );
  expect(postIsValid).toMatchObject({ isValid: false });
});

it('should be false if nothing changes', () => {
  const postIsValid = existingPostIsValid(
    uploadsInProgress,
    oldTitle,
    oldTitle,
    oldContent,
    oldContent,
    oldChannel,
    oldChannel,
    oldTags,
    oldTags,
  );
  expect(postIsValid).toMatchObject({ isValid: false });
});

it('should be true if the title changes', () => {
  const postIsValid = existingPostIsValid(
    uploadsInProgress,
    title,
    oldTitle,
    oldContent,
    oldContent,
    oldChannel,
    oldChannel,
    oldTags,
    oldTags,
  );
  expect(postIsValid).toMatchObject({ isValid: true });
});

it('should be true if the content changes', () => {
  const postIsValid = existingPostIsValid(
    uploadsInProgress,
    oldTitle,
    oldTitle,
    content,
    oldContent,
    oldChannel,
    oldChannel,
    oldTags,
    oldTags,
  );
  expect(postIsValid).toMatchObject({ isValid: true });
});

it('should be true if the channel changes', () => {
  const postIsValid = existingPostIsValid(
    uploadsInProgress,
    oldTitle,
    oldTitle,
    oldContent,
    oldContent,
    channel,
    oldChannel,
    oldTags,
    oldTags,
  );
  expect(postIsValid).toMatchObject({ isValid: true });
});

it('should be true if tags change', () => {
  const postIsValid = existingPostIsValid(
    uploadsInProgress,
    oldTitle,
    oldTitle,
    oldContent,
    oldContent,
    oldChannel,
    oldChannel,
    tags,
    oldTags,
  );
  expect(postIsValid).toMatchObject({ isValid: true });
});

it('should be true if all data changes', () => {
  const postIsValid = existingPostIsValid(
    uploadsInProgress,
    title,
    oldTitle,
    content,
    oldContent,
    channel,
    oldChannel,
    tags,
    oldTags,
  );
  expect(postIsValid).toMatchObject({ isValid: true });
});
