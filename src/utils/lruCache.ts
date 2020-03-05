import LruCache from "lru-cache";
import { StocksResponse } from "../typing";

export const pricesCache = new LruCache<string, StocksResponse>({
    maxAge: 1000*60*100
});
