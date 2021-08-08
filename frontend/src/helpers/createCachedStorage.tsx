/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
  createContext,
  ReactElement,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type JsonValue =
  | null
  | boolean
  | number
  | string
  | Array<JsonValue>
  | { [key: string]: JsonValue };

type Reviver<T> = (parsed: JsonValue) => T;

type DataStore<T extends object> = {
  getItem: <Key extends keyof T>(key: Key) => T[Key] | null;
  setItem: <Key extends keyof T>(key: Key, value: T[Key]) => void;
  removeItem: <Key extends keyof T>(key: Key) => void;
};

export function createCachedStorage<
  Obj extends object,
  Schema extends {
    [K in keyof Obj]: Obj[K] extends Reviver<infer T> ? Reviver<T> : never;
  },
  Data extends {
    [K in keyof Schema]: Schema[K] extends Reviver<infer T> ? T : never;
  }
>(schema: Schema, prefix = '') {
  const Context = createContext<DataStore<Data> | undefined>(undefined);

  let StorageProvider = (props: { children: ReactElement }) => {
    let [isLoading, setLoading] = useState(true);
    let dataRef = useRef<Partial<Data>>({});

    useEffect(() => {
      let data = dataRef.current;
      let load = async () => {
        for (let key of Object.keys(schema) as Array<keyof Schema>) {
          let value = await AsyncStorage.getItem(prefix + key);
          if (value != null) {
            let reviver = schema[key];
            try {
              // This will throw if the string does not parse or if the parsed
              // value cannot be revived successfully.
              data[key] = reviver(JSON.parse(value)) as any;
            } catch (e) {}
          }
        }
        setLoading(false);
      };
      load();
    }, []);

    let context = useMemo(() => {
      let data = dataRef.current;

      return {
        getItem: (key) => data[key] ?? null,
        setItem: (key, value) => {
          data[key] = value;
          // TODO: Throttle this so if we write in rapid succession (such as
          // onScroll saving scroll position) we won't thrash the disk.
          AsyncStorage.setItem(prefix + key, JSON.stringify(value));
        },
        removeItem: (key) => {
          data[key] = undefined;
          AsyncStorage.removeItem(prefix + key);
        },
      } as DataStore<Data>;
    }, []);

    return isLoading ? null : (
      <Context.Provider value={context}>{props.children}</Context.Provider>
    );
  };

  let useStorage = () => {
    const context = useContext(Context);

    if (context === undefined) {
      throw new Error();
    }

    return context;
  };

  return [StorageProvider, useStorage] as const;
}
