/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// source: https://github.com/lane-c-wagner/react-native-expo-cached-image

import React, { Component } from 'react';
import {
  Image,
  ImageStyle,
  ImageURISource,
  InteractionManager,
  StyleProp,
} from 'react-native';
import * as Crypto from 'expo-crypto';
import * as FileSystem from 'expo-file-system';
import ImageView from 'react-native-image-viewing';

type Interaction = {
  then: (
    onfulfilled?: (() => unknown) | undefined,
    onrejected?: (() => unknown) | undefined,
  ) => Promise<unknown>;
  done: (...args: []) => unknown;
  cancel: () => void;
};

type Props = {
  source: Omit<ImageURISource, 'uri'> & { uri: string };
  isBackground?: boolean;
  style: StyleProp<ImageStyle>;
  visible?: boolean;
  setVisible?: () => void;
  sizeStyle?: { width?: number; height: number };
};

export default class CachedImage extends Component<Props> {
  mounted = true;
  _interaction: Interaction | null = null;
  downloadResumable: FileSystem.DownloadResumable | null = null;
  state = { imgURI: '' };

  async componentDidMount() {
    this._interaction = InteractionManager.runAfterInteractions(async () => {
      if (this.props.source.uri) {
        const filesystemURI = await this.getImageFilesystemKey(
          this.props.source.uri,
        );
        await this.loadImage(filesystemURI, this.props.source.uri);
      }
    });
  }

  async componentDidUpdate() {
    if (this.props.source.uri) {
      const filesystemURI = await this.getImageFilesystemKey(
        this.props.source.uri,
      );
      if (
        this.props.source.uri === this.state.imgURI ||
        filesystemURI === this.state.imgURI
      ) {
        return;
      }
      await this.loadImage(filesystemURI, this.props.source.uri);
    }
  }

  async componentWillUnmount() {
    this._interaction && this._interaction.cancel();
    this.mounted = false;
    await this.checkClear();
  }

  async checkClear() {
    try {
      if (this.downloadResumable) {
        const t = await this.downloadResumable.pauseAsync();
        const filesystemURI = await this.getImageFilesystemKey(
          this.props.source.uri,
        );
        const metadata = await FileSystem.getInfoAsync(filesystemURI);
        if (metadata.exists) {
          await FileSystem.deleteAsync(t.fileUri);
        }
      }
    } catch (error) {}
  }

  async getImageFilesystemKey(remoteURI: string) {
    const hashed = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      remoteURI,
    );
    return `${FileSystem.documentDirectory}${hashed}`;
  }

  async loadImage(filesystemURI: string, remoteURI: string) {
    // TODO: Migrate to a newer library or implement our own CachedImage
    // @ts-ignore
    if (this.downloadResumable && this.downloadResumable._removeSubscription) {
      // TODO: Migrate to a newer library or implement our own CachedImage
      // @ts-ignore
      this.downloadResumable._removeSubscription();
    }
    try {
      // Use the cached image if it exists
      const metadata = await FileSystem.getInfoAsync(filesystemURI);
      if (metadata.exists && this.mounted) {
        this.setState({
          imgURI: filesystemURI,
        });
        return;
      }

      // otherwise download to cache
      this.downloadResumable = FileSystem.createDownloadResumable(
        remoteURI,
        filesystemURI,
        {},
        (dp) => this.onDownloadUpdate(dp),
      );

      const imageObject = await this.downloadResumable.downloadAsync();
      if (this.mounted) {
        if (imageObject && imageObject.status === 200) {
          this.setState({
            imgURI: imageObject.uri,
          });
        }
      }
    } catch (err) {
      if (this.mounted) {
        this.setState({ imgURI: null });
      }
      const metadata = await FileSystem.getInfoAsync(filesystemURI);
      if (metadata.exists) {
        try {
          await FileSystem.deleteAsync(filesystemURI);
        } catch (err) {}
      }
    }
  }

  onDownloadUpdate(downloadProgress: FileSystem.DownloadProgressData) {
    if (
      downloadProgress.totalBytesWritten >=
      downloadProgress.totalBytesExpectedToWrite
    ) {
      if (
        this.downloadResumable &&
        // TODO: Migrate to a newer library or implement our own CachedImage
        // @ts-ignore
        this.downloadResumable._removeSubscription
      ) {
        // TODO: Migrate to a newer library or implement our own CachedImage
        // @ts-ignore
        this.downloadResumable._removeSubscription();
      }
      this.downloadResumable = null;
    }
  }

  render() {
    let source = this.state.imgURI
      ? { uri: this.state.imgURI }
      : this.props.source;
    if (!source && this.props.source) {
      source = { ...this.props.source, cache: 'force-cache' };
    }
    if (
      this.props.isBackground &&
      typeof this.props.visible === 'boolean' &&
      this.props.setVisible
    ) {
      return (
        <ImageView
          images={[{ uri: source.uri }]}
          imageIndex={0}
          visible={this.props.visible}
          onRequestClose={this.props.setVisible}
          animationType="fade"
        />
      );
    } else {
      return <Image {...this.props} source={source} />;
    }
  }
}
