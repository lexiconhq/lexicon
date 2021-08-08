type Error = { status: 'ERROR'; error: string };
type Loading = { status: 'LOADING'; loading: string };
type Data<T> = { status: 'LOADED'; data: Array<T> };

export type ContentState<T> = Data<T> | Loading | Error;
