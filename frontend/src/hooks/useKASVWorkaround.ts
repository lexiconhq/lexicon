import React from 'react';
import { findNodeHandle } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { TextArea } from '../components';

type ScrollToInput = KeyboardAwareScrollView['scrollToFocusedInput'];

/**
 * KASV is an abbreviation of `KeyboardAwareScrollView`. This type is used to
 * add type support to the ref returned by the component, with which we are doing
 * something non-standard as a workaround: accessing the internal properties of the
 * component.
 */
type KASVRef = JSX.Element & {
  getScrollResponder: () => {
    props: {
      scrollToFocusedInput: ScrollToInput;
    };
  };
};

type TextAreaFocusHandler = React.ComponentProps<typeof TextArea>['onFocus'];

/**
 * `useKASVWorkaround` (KASV -> KeyboardAwareScrollView) is a reusable hook to
 * implement a (hacky) workaround [discussed with the maintainer](https://github.com/APSL/react-native-keyboard-aware-scroll-view/issues/451)
 * for a bug we were encountering after upgrading from Expo 38 to Expo 42 in July of 2021.
 *
 * For brief context, the app would crash with an undefined error after attempting to focus
 * a TextArea input that was interacting with KeyboardAwareScrollView. This was due to us
 * attempting to invoke `scrollToFocusedInput` in way recommended by the docs.
 *
 * The hook provides `props`, which are meant to be spread onto the
 * `KeyboardAwareScrollView`. This will allow the `innerRef` prop to be set correctly.
 *
 * The hook then also provides `scrollToFocusedInput`, which is the function we were
 * originally calling with a ref workaround.
 *
 */
export function useKASVWorkaround() {
  const scrollRef = React.useRef<JSX.Element>();
  const scrollToInputRef = React.useRef<ScrollToInput>();

  function innerRef(ref: JSX.Element) {
    scrollRef.current = ref;
    if (!ref) {
      return;
    }

    const refWithWorkAround = (ref as unknown) as KASVRef;

    const { getScrollResponder } = refWithWorkAround;
    if (!getScrollResponder) {
      return;
    }

    const responder = getScrollResponder();
    if (!responder) {
      return;
    }

    const { props } = responder;
    if (!props) {
      return;
    }

    const { scrollToFocusedInput } = props;

    if (!scrollToFocusedInput) {
      return;
    }

    scrollToInputRef.current = scrollToFocusedInput;
  }

  const scrollToFocusedInput: TextAreaFocusHandler = ({ target }) => {
    const { current } = scrollToInputRef;
    if (!current) {
      return;
    }

    const scrollToFocusedInput = current;
    if (!scrollToFocusedInput) {
      return;
    }

    const handle = findNodeHandle(target);
    if (handle == null) {
      return;
    }

    scrollToFocusedInput(handle);
  };

  return {
    scrollToFocusedInput,
    props: {
      innerRef,
    },
  };
}
