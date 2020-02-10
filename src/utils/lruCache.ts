import LruCache from "lru-cache";
import { SymbolData } from "../typing";

export const pricesCache = new LruCache<string, SymbolData>({
    maxAge: 1000*60*10
});

export const unknownSymbolsCache = new LruCache<string, SymbolData>({
    maxAge: 1000*60*60*24
});