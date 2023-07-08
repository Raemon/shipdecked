import { includes, some } from "lodash";
import { CardSlug } from "./cards";

export function hasCommonElement (array1: Array<CardSlug>, array2:Array<CardSlug>) {
  some(array1, function(item) {
    return includes(array2, item);
  });
}