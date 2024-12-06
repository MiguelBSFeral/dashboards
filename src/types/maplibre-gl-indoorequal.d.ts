declare module "maplibre-gl-indoorequal" {
    import { Map as MapLibreMap } from "maplibre-gl";
    import {Map} from 'leaflet';

    export default class IndoorEqual {
        constructor(
            map: maplibregl.Map,
            options?: {levelsControl?: boolean, apiKey: string},
        );

        setLevel(level: string): void;
        remove(): void;
        on(event: string, callback: (...args: any[]) => void): void;
        off(event: string, callback: (...args: any[]) => void): void;
    }
}
