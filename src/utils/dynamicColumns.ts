import { ref } from "vue";
import { globalConfig } from "../../config";

export const columnCount = ref(3);

export const updateColumns = () => {
  const width = window.innerWidth;
  if (width < globalConfig.waterfall.oneColumnMax) {
    columnCount.value = 1;
  } else if (width < globalConfig.waterfall.twoColumnMax) {
    columnCount.value = 2;
  } else {
    columnCount.value = 3;
  }
};
