import LruCache from "lru-cache";
import { CachedResponse } from "../typing";

export const succeedRequestsCache = new LruCache<string, CachedResponse>({
    maxAge: 1000*60*10
});

export const badRequestsCache = new LruCache<string, CachedResponse>({
    maxAge: 1000*60*60*24
});